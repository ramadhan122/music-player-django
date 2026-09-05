import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "musicplayer.settings")

from django.core.management import execute_from_command_line


if __name__ == "__main__":
    execute_from_command_line([
        "django_launcher.py",
        "runserver",
        "127.0.0.1:8000",
        "--noreload",
    ])