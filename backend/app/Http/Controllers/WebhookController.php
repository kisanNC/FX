<?php

namespace App\Http\Controllers;
use App\Models\ContactForm;
use Illuminate\Http\Request;

class WebhookController extends Controller
{
    public function handle(Request $request)
    {
        // You can log this to inspect structure
        // Log::info($request->all());

        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'message' => 'nullable|string',
        ]);

        ContactForm::create($validated);

        return response()->json(['status' => 'success']);
    }
}
