from django.shortcuts import render
from .models import Song

def home(request):
    songs = list(Song.objects.all())
    return render(request, 'player/home.html', {'songs': songs})
