from django.db import models

class Song(models.Model):
    title = models.CharField(max_length=200)
    artist = models.CharField(max_length=200, blank=True, null=True)
    file = models.FileField(upload_to='songs/')
    cover = models.ImageField(upload_to='covers/', blank=True, null=True)
    lyric = models.TextField(blank=True, null=True)  # lirik biasa
    lrc = models.TextField(blank=True, null=True)    # simpan format LRC

    def __str__(self):
        return self.title
