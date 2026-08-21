import random
def generate_room_code():
    # TODO: Implement a more robust room code generation logic to avoid collisions and ensure uniqueness
    MAX_LENGTH = 6
    # Generate a random room code consisting of uppercase letters and digits
    characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    room_code = ''.join(random.choice(characters) for _ in range(MAX_LENGTH))
    return room_code