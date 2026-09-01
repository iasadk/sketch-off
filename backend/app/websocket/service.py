from fastapi import WebSocket
from core.socket_connection_manager import manager, Message
from app.rooms.services import getRoom, updateChooseWord, checkWord, updateScore, check_all_participants_gussed, round_over

async def broadcast_players(room_code: str, players: list):
    await manager.broadcast_to_room(
        room_code=room_code,
        message=Message(type="PLAYERS", content={"players": players}),
    )


async def broadcast_chat(room_code: str, msg: str, color: str):
    await manager.broadcast_to_room(
        room_code=room_code,
        message=Message(type="CHAT", content={"msg": msg, "color": color}),
    )


async def handle_join(websocket: WebSocket, room_code: str, data: dict):
    unique_user_id = data["content"]["unique_user_id"]
    manager.add_connection(websocket=websocket, room_code=room_code, unique_user_id=unique_user_id)

    room_info = await getRoom(room_code=room_code)
    player_info = next(
        (p for p in room_info["players"] if p["uuid"] == unique_user_id), None
    )

    await broadcast_players(room_code, room_info["players"])

    game_state = room_info["game_state"]
    await manager.broadcast_to_room(
        room_code=room_code,
        message=Message(
            type="GAME_STATE",
            content={
                "game_state": game_state["status"],
                "current_round": game_state["current_round"],
                "total_rounds": game_state["total_rounds"],
                "artist_id": game_state["artist_id"],
                "round_duration": game_state["round_duration"],
                "round_started_at": game_state["round_started_at"],
                "choose_word_duration": game_state["choose_word_duration"],
                "choose_word_started_at": game_state["choose_word_started_at"],
                "choosed_word": game_state["choosed_word"],
            },
        ),
    )

    player_name = player_info["name"] if player_info else "New Player"
    await broadcast_chat(room_code, f"{player_name} Joined", "GREEN")


async def handle_draw(websocket: WebSocket, room_code: str, data: dict):
    room_info = await getRoom(room_code=room_code)
    connection_info = manager.get_connection_info(room_code=room_code, websocket=websocket)
    artist_id = room_info["game_state"]["artist_id"]

    # Only the artist may propagate DRAW events, and only to the other participants
    is_artist_drawing = (
        room_info["game_state"]["status"] == "ROUND_START"
        and connection_info["player_unique_id"] == artist_id
    )
    if is_artist_drawing:
        await manager.selective_broadcast(
            room_code=room_code,
            message=Message(type="DRAW", content=data["content"]),
            selection_type="EXCLUDE",
            uuid=artist_id,
        )


async def handle_word_selected(websocket: WebSocket, room_code: str, data: dict):
    room_info = await getRoom(room_code=room_code)
    connection_info = manager.get_connection_info(room_code=room_code, websocket=websocket)

    is_artist_choosing = (
        room_info["game_state"]["status"] == "CHOOSING_WORD"
        and connection_info["player_unique_id"] == room_info["game_state"]["artist_id"]
    )
    if is_artist_choosing:
        await updateChooseWord(room_code=room_code, word=data["content"]["word"])


async def handle_chat(websocket: WebSocket, room_code: str, data: dict):
    room_info = await getRoom(room_code=room_code)
    connection_info = manager.get_connection_info(room_code=room_code, websocket=websocket)
    player_id = connection_info["player_unique_id"]

    if room_info["game_state"]["artist_id"] == player_id:
        return

    player_info = next(
        (p for p in room_info["players"] if p["uuid"] == player_id), None
    )

    msg = f"{player_info['name']}: {data['content']['msg']}"
    color = "BLACK"

    is_guessable = (
        room_info["game_state"]["status"] == "ROUND_START"
        and not player_info["is_guessed"]
    )

    if is_guessable:
        is_correct = await checkWord(
            room_code=room_code,
            word=data["content"]["msg"],
            phase_id=room_info["game_state"]["phase_id"],
        )
        if is_correct:
            updated_room_info = await updateScore(room_code=room_code, player_unique_id=player_id)
            msg = f"{player_info['name']}: Guessed the word"
            color = "GREEN"

            await broadcast_players(room_code, updated_room_info["players"])

            if await check_all_participants_gussed(room_code=room_code):
                await round_over(room_code=room_code)
        else:
            msg = f"{player_info['name']}: {data['content']['msg']} (Incorrect Guess)"
            color = "RED"

    await broadcast_chat(room_code, msg, color)


async def handle_clear_canvas(room_code: str):
    await manager.broadcast_to_room(
        room_code=room_code,
        message=Message(type="CLEAR_CANVAS", content={"msg": "Canvas cleared"}),
    )
