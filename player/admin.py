from django.contrib import admin
from .models import Song

@admin.register(Song)
class SongAdmin(admin.ModelAdmin):
    list_display = ("title", "artist")
    search_fields = ("title", "artist")
    fields = ("title", "artist", "file", "cover", "lrc")
