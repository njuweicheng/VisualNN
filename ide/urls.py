from django.conf.urls import url, include
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings
from views import index, calculate_parameter, fetch_layer_shape
from views import load_from_db, save_to_db, fetch_model_history
from views import upload_training_data, start_training, get_training_data

urlpatterns = [
    url(r'^$', index),
    url(r'^admin/', admin.site.urls),
    url(r'^accounts/', include('allauth.urls')),
    url(r'^backendAPI/', include('backendAPI.urls')),
    url(r'^caffe/', include('caffe_app.urls')),
    url(r'^keras/', include('keras_app.urls')),
    url(r'^tensorflow/', include('tensorflow_app.urls')),
    url(r'^save$', save_to_db, name='saveDB'),
    url(r'^load*', load_from_db, name='loadDB'),
    url(r'^model_history', fetch_model_history, name='model-history'),
    url(r'^model_parameter/', calculate_parameter, name='calculate-parameter'),
    url(r'^layer_parameter/', fetch_layer_shape, name='fetch-layer-shape'),
    url(r'^upload_training_data',upload_training_data,name = 'upload_training_data'),
    url(r'^start_training', start_training, name = 'start_training'), 
    url(r'^get_training_data', get_training_data, name = 'get_training_data'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + \
    static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
