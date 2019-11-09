# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.http import JsonResponse
from django.contrib.auth.models import User

def sign_up(request):
    try:
	username = request.GET['username']
	password = request.GET['password']
	
	querySet = User.objects.filter(username=username)

	# check if username already exists.
	if len(querySet) > 0:
	    return JsonResponse({
	        'result': True,
	        'info': 'User_exists',
	        'username': username
	    })

	# save user to db
	user = User.objects.create(username=username, password=password)

	# testUser = User.objects.get(username=username)
	# if testUser != None:
	#    print("successfully saved.")
	return JsonResponse({
            'result': True,
	    'info': 'User_create_success',
            'username': username
        })
	
    except Exception as e:
        return JsonResponse({
            'result': False,
	    'info': str(e)
        })

def check_login(request):
    try:
        if request.GET.get('isOAuth') == 'false':
            username = request.GET['username']
            password = request.GET['password']
            user = User.objects.get(username=username)
            user_id = user.id

            if not user.check_password(password):
                return JsonResponse({
                    'result': False,
                    'error': 'Please enter valid credentials'
                })

            is_authenticated = user.is_authenticated()
            if (is_authenticated):
                username = user.username

            return JsonResponse({
                'result': is_authenticated,
                'user_id': user_id,
                'username': username,
            })
        else:
            user = User.objects.get(username=request.user.username)
            user_id = user.id
            username = 'Anonymous'

            is_authenticated = user.is_authenticated()
            if (is_authenticated):
                username = user.username

            return JsonResponse({
                'result': is_authenticated,
                'user_id': user_id,
                'username': username
            })
    except Exception as e:
        return JsonResponse({
            'result': False,
            'error': str(e)
        })
