# Generated by Django 4.2.7 on 2025-05-25 15:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_user_ban_reason_user_banned_at_user_is_banned'),
    ]

    operations = [
        migrations.AddField(
            model_name='investment',
            name='maturity_period',
            field=models.IntegerField(blank=True, help_text='Duration in days until investment matures', null=True),
        ),
    ]
