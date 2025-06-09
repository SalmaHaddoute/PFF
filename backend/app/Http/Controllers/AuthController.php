<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\User;
use App\Models\Entreprise;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'motdepasse' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->motdepasse),
            'role' => 'user', // Default role
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'User registered successfully',
            'user' => $user,
            'token' => $token,
            'user_type' => $user->role
        ], 201);
    }

    /**
     * Login user
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'motdepasse' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        Log::info('Login attempt', ['email' => $request->email, 'password_provided' => true]);
        
        // First check if this is an admin login
        $email = $request->email;
        $password = $request->motdepasse;
        
        // Check for admin account first
        if ($email === 'admin@example.com') {
            $admin = Admin::where('email', $email)->first();
            
            if (!$admin) {
                Log::warning('Admin not found but should exist: ' . $email);
                return response()->json([
                    'message' => 'Admin account not found.'
                ], 422);
            }
            
            // Verify admin password - Admin model uses 'motdepasse' field
            if (!Hash::check($password, $admin->motdepasse)) {
                Log::warning('Admin password incorrect for: ' . $email);
                return response()->json([
                    'message' => 'The provided credentials are incorrect.'
                ], 422);
            }
            
            // Admin login successful
            $token = $admin->createToken('auth_token')->plainTextToken;
            
            return response()->json([
                'status' => 'authenticated',
                'message' => 'Admin login successful',
                'user' => $admin,
                'token' => $token,
                'user_type' => 'admin'
            ]);
        }
        
        // Check if this is an enterprise login
        $entreprise = Entreprise::where('email', $email)->first();
        if ($entreprise) {
            Log::info('Enterprise login attempt', ['email' => $email]);
            // Verify enterprise password - Entreprise model uses 'motdepasse' field
            if (!Hash::check($password, $entreprise->motdepasse)) {
                Log::warning('Enterprise password incorrect for: ' . $email);
                return response()->json([
                    'message' => 'Les informations d\'identification fournies sont incorrectes.'
                ], 422);
            }
            
            // Check enterprise status
            if ($entreprise->status === 'refusé' || $entreprise->status === 'refuse') {
                return response()->json([
                    'message' => 'Votre compte a été refusé.'
                ], 403);
            }
            
            // Enterprise login successful
            $token = $entreprise->createToken('auth_token')->plainTextToken;
            
            return response()->json([
                'status' => 'authenticated',
                'message' => 'Connexion entreprise réussie',
                'user' => $entreprise,
                'token' => $token,
                'user_type' => 'entreprise'
            ]);
        }
        
        // If not admin or enterprise, attempt regular user authentication
        if (!Auth::attempt(['email' => $email, 'password' => $password])) {
            // If authentication fails, check if user exists
            $user = User::where('email', $email)->first();
            if (!$user) {
                Log::warning('User not found: ' . $email);
                return response()->json([
                    'message' => 'Utilisateur non trouvé.'
                ], 422);
            }
            
            return response()->json([
                'message' => 'Les informations d\'identification fournies sont incorrectes.'
            ], 422);
        }

        $user = $request->user();
        $token = $user->createToken('auth_token')->plainTextToken;
        
        // Special case for admin credentials as mentioned in your memories
        if ($user->email === 'admin@example.com') {
            return response()->json([
                'status' => 'authenticated',
                'message' => 'Login successful',
                'user' => $user,
                'token' => $token,
                'user_type' => 'admin'
            ]);
        }

        return response()->json([
            'status' => 'authenticated',
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
            'user_type' => $user->role
        ]);
    }

    /**
     * Logout user
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Logged out successfully'
        ]);
    }
}
