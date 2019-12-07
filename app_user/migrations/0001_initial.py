# Generated by Django 2.1.5 on 2019-12-02 08:03

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import jsonfield.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='IndexJSONModel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('json', jsonfield.fields.JSONField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='IntroBaseModel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('head', models.CharField(blank=True, max_length=255, null=True)),
                ('word', models.CharField(blank=True, max_length=255, null=True)),
                ('text', models.TextField(blank=True, max_length=255, null=True)),
                ('link', models.TextField(blank=True, null=True, validators=[django.core.validators.URLValidator()])),
                ('back', models.TextField(blank=True, null=True, validators=[django.core.validators.URLValidator()])),
            ],
        ),
        migrations.CreateModel(
            name='IntroModel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time', models.DateTimeField(blank=True, default=django.utils.timezone.now, null=True)),
                ('head', models.CharField(blank=True, max_length=255, null=True)),
                ('text', models.TextField(blank=True, max_length=255, null=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='IntroCardModel',
            fields=[
                ('introbasemodel_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='app_user.IntroBaseModel')),
                ('card_col', models.IntegerField(blank=True, default=6, null=True)),
                ('pop_over', models.TextField(blank=True, max_length=255, null=True)),
            ],
            bases=('app_user.introbasemodel',),
        ),
        migrations.CreateModel(
            name='IntroGridModel',
            fields=[
                ('introbasemodel_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='app_user.IntroBaseModel')),
                ('design', models.IntegerField(blank=True, default=1, null=True)),
                ('note_url', models.TextField(blank=True, null=True, validators=[django.core.validators.URLValidator()])),
                ('note_qty', models.IntegerField(blank=True, default=0, null=True)),
            ],
            bases=('app_user.introbasemodel',),
        ),
        migrations.AddField(
            model_name='introbasemodel',
            name='intro',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app_user.IntroModel'),
        ),
    ]
