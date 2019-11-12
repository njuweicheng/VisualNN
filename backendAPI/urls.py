from django.conf.urls import url
from views import check_login, sign_up

urlpatterns = [
    url(r'^checkLogin$', check_login),
    url(r'^signUp$', sign_up)
]
