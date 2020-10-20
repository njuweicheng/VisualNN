from django.conf.urls import url
from views import check_login, sign_up, log_in

urlpatterns = [
    url(r'^checkLogin$', check_login),
    url(r'^signUp$', sign_up),
    url(r'^logIn$', log_in)
]
