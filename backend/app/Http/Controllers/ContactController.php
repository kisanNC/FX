<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contact;

class ContactController extends Controller
{
    // ✅ CREATE
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:100',
            'description' => 'required|string',
            'status' => 'nullable|in:Pending,In Progress,Resolved',
        ]);

        // If no status provided, set default to 'Pending'
        $contact = Contact::create([
            'name' => $request->name,
            'type' => $request->type,
            'description' => $request->description,
            'status' => $request->status ?? 'Pending',
        ]);

        return response()->json([
            'message' => 'Contact submitted successfully!',
            'data' => $contact
        ]);
    }

    // ✅ READ ALL
    public function index()
    {
        $contacts = Contact::all();
        return response()->json($contacts);
    }

    // ✅ READ SINGLE
    public function show($id)
    {
        $contact = Contact::findOrFail($id);
        return response()->json($contact);
    }

    // ✅ UPDATE (all fields including status)
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|required|string|max:100',
            'description' => 'sometimes|required|string',
            'status' => 'sometimes|nullable|in:Pending,In Progress,Resolved',
        ]);

        $contact = Contact::findOrFail($id);

        // Merge default status if it's missing (optional)
        $data = $request->only(['name', 'type', 'description', 'status']);
        $contact->update($data);

        return response()->json([
            'message' => 'Contact updated successfully!',
            'data' => $contact
        ]);
    }

    // ✅ DELETE
    public function destroy($id)
    {
        $contact = Contact::findOrFail($id);
        $contact->delete();

        return response()->json([
            'message' => 'Contact deleted successfully!'
        ]);
    }

    // ✅ UPDATE STATUS ONLY
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Pending,In Progress,Resolved',
        ]);

        $contact = Contact::findOrFail($id);
        $contact->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Status updated successfully!',
            'data' => $contact
        ]);
    }
}
