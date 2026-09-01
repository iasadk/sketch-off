import random

from lib.constants import DRAWABLE_WORDS
def generate_room_code():
    # TODO: Implement a more robust room code generation logic to avoid collisions and ensure uniqueness
    MAX_LENGTH = 6
    # Generate a random room code consisting of uppercase letters and digits
    characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    room_code = ''.join(random.choice(characters) for _ in range(MAX_LENGTH))
    return room_code


def get_random_words(count: int = 3) -> list[str]:
    return random.sample(DRAWABLE_WORDS, count)
