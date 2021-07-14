from django.shortcuts import render
from django.forms.models import model_to_dict
from django.http import JsonResponse
import json

# Create your views here.
def index(request):
    return render(request, "pages/index.html")

def command(request):
    if request.method == "POST":
        data = json.loads(request.body)
        requestCommand = data.get("body").lower()
        if requestCommand == "":
            return JsonResponse({
                            "code": 200,
                            "message": "I need a command to do something..."
                            })
        if "how are you" in requestCommand:
            return JsonResponse({
                            "code": 200,
                            "message": "I am doing great, thank you for asking!"
                            })
        if "who are you" in requestCommand:
            return JsonResponse({
                            "code": 200,
                            "message": "My name is Jarvis"
                            })
        return JsonResponse({
                        "code": 200,
                        "message": ""
                        })
