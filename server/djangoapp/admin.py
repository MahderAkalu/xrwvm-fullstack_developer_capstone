from django.contrib import admin
from .models import CarMake, CarModel


# CarModelInline class
class CarModelInline(admin.TabularInline):  # shows CarModels inside CarMake
    model = CarModel
    extra = 1


# CarModelAdmin class
class CarModelAdmin(admin.ModelAdmin):
    list_display = ("name", "car_make", "type", "year")   # use 'type' not 'car_type'
    list_filter = ("type", "year", "car_make")            # same here
    search_fields = ("name",)


# CarMakeAdmin class with CarModelInline
class CarMakeAdmin(admin.ModelAdmin):
    list_display = ("name", "description")
    search_fields = ("name",)
    inlines = [CarModelInline]


# Register models here
admin.site.register(CarMake, CarMakeAdmin)
admin.site.register(CarModel, CarModelAdmin)