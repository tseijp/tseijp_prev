from django import template
register = template.Library()

@register.filter(name="addf")
def addf(value, arg):
    return float(value) + float(arg)

#addf.is_safe = False
#register.filter(addf)
