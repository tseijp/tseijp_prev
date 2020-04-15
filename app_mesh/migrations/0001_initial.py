# Generated by Django 2.1.5 on 2020-01-17 10:57

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='MeshModel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('posted_time', models.DateTimeField(blank=True, default=django.utils.timezone.now, null=True)),
                ('posted_data', models.CharField(blank=True, max_length=255, null=True)),
                ('posted_link', models.CharField(blank=True, max_length=255, null=True)),
                ('ja_text', models.TextField(blank=True, max_length=65535, null=True)),
                ('en_text', models.TextField(blank=True, max_length=65535, null=True)),
                ('posted_user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='MeshSNSModel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('posted_time', models.DateTimeField(blank=True, default=django.utils.timezone.now, null=True)),
                ('posted_link', models.CharField(blank=True, max_length=255, null=True)),
                ('mesh_object', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app_mesh.MeshModel')),
                ('posted_user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]