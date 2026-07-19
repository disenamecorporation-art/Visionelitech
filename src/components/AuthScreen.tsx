import React, { useState } from 'react';
import { X, User, Lock, Mail, Phone, MapPin, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cyberSound } from './CyberSound';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthScreenProps {
  mode: 'login' | 'registro';
  onClose: () => void;
  onLoginSuccess: (isAdmin: boolean, email: string) => void;
}

export default function AuthScreen({ mode, onClose, onLoginSuccess }: AuthScreenProps) {
  const [authMode, setAuthMode] = useState<'login' | 'registro'>(mode);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Caracas');

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    cyberSound.playClick();

    if (!email || !password) {
      setErrorMsg('Por favor ingresa tu correo electrónico y contraseña.');
      return;
    }

    const emailLower = email.toLowerCase().trim();

    if (authMode === 'registro') {
      if (!fullName) {
        setErrorMsg('El nombre completo es requerido.');
        return;
      }
      if (!phone) {
        setErrorMsg('El teléfono es requerido.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Las contraseñas no coinciden.');
        return;
      }
      if (password.length < 5) {
        setErrorMsg('La contraseña debe tener al menos 5 caracteres.');
        return;
      }

      // 1. Supabase Register Integration if configured
      if (isSupabaseConfigured && supabase) {
        try {
          // Sign Up the user
          const { data, error } = await supabase.auth.signUp({
            email: emailLower,
            password: password,
            options: {
              data: {
                full_name: fullName,
                phone: phone,
                city: city,
                address: address
              }
            }
          });

          if (error) {
            setErrorMsg(error.message);
            return;
          }

          // Insert extra profile details into the public profiles table
          if (data.user) {
            const { error: profileError } = await supabase
              .from('profiles')
              .upsert({
                id: data.user.id,
                email: emailLower,
                full_name: fullName,
                phone: phone,
                city: city,
                address: address,
                is_admin: emailLower === 'admin@visionelitech.com' || emailLower === 'disenamecorporation@gmail.com' || emailLower === 'visionelitech@gmail.com'
              });

            if (profileError) {
              console.error("Error setting up profile in database:", profileError.message);
            }
          }

          setSuccessMsg('¡Registro exitoso en Supabase! Ya puedes iniciar sesión.');
          setTimeout(() => {
            setAuthMode('login');
            setErrorMsg('');
            setSuccessMsg('');
          }, 1500);
          return;
        } catch (err: any) {
          setErrorMsg(err.message || 'Error al conectar con Supabase para el registro.');
          return;
        }
      }

      // Local storage fallback if Supabase is not configured
      const users = JSON.parse(localStorage.getItem('visionelitech_users') || '[]');
      if (users.some((u: any) => u.email.toLowerCase() === emailLower)) {
        setErrorMsg('Este correo ya se encuentra registrado.');
        return;
      }

      const newUser = { fullName, phone, email: emailLower, password, address, city, isAdmin: false };
      users.push(newUser);
      localStorage.setItem('visionelitech_users', JSON.stringify(users));

      setSuccessMsg('¡Registro exitoso! Ya puedes iniciar sesión.');
      setTimeout(() => {
        setAuthMode('login');
        setErrorMsg('');
        setSuccessMsg('');
      }, 1500);
      return;
    }

    // 2. Login Logic
    // Admin override (for quick testing / developer accessibility)
    if (
      (emailLower === 'admin@visionelitech.com' || emailLower === 'disenamecorporation@gmail.com' || emailLower === 'visionelitech@gmail.com') &&
      (password === 'admin123' || password === 'admin')
    ) {
      setSuccessMsg('¡Acceso concedido como Administrador!');
      setTimeout(() => {
        onLoginSuccess(true, emailLower);
      }, 1000);
      return;
    }

    // Supabase Login Integration if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailLower,
          password: password
        });

        if (error) {
          setErrorMsg(error.message);
          return;
        }

        if (data.user) {
          // Check if this user is marked as admin in the public.profiles table
          let isAdmin = emailLower === 'admin@visionelitech.com' || emailLower === 'disenamecorporation@gmail.com' || emailLower === 'visionelitech@gmail.com';
          
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', data.user.id)
            .single();

          if (!profileError && profile) {
            isAdmin = isAdmin || !!profile.is_admin;
          }

          const userName = data.user.user_metadata?.full_name || emailLower.split('@')[0];
          setSuccessMsg(`¡Bienvenido de vuelta, ${userName}!`);
          setTimeout(() => {
            onLoginSuccess(isAdmin, emailLower);
          }, 1000);
          return;
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Error de autenticación con Supabase.');
        return;
      }
    }

    // Local storage fallback login
    const users = JSON.parse(localStorage.getItem('visionelitech_users') || '[]');
    const foundUser = users.find((u: any) => u.email.toLowerCase() === emailLower && u.password === password);

    if (foundUser) {
      setSuccessMsg(`¡Bienvenido de vuelta, ${foundUser.fullName}!`);
      setTimeout(() => {
        onLoginSuccess(foundUser.isAdmin || false, emailLower);
      }, 1000);
      return;
    }

    setErrorMsg('Credenciales inválidas. Para ingresar al panel administrativo usa admin@visionelitech.com con contraseña admin123');
  };

  const handleForgotPassword = () => {
    cyberSound.playClick();
    alert('Se ha enviado un correo de recuperación a ' + (email || 'tu dirección de correo electrónico') + ' (Demostración local).');
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-zinc-950/70 backdrop-blur-xl border border-white/10 p-8 rounded-3xl w-full max-w-lg shadow-[0_0_50px_rgba(0,149,255,0.15)] relative overflow-y-auto max-h-[90vh]">
        
        {/* Glow decorative borders */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/20 via-purple-500/40 to-pink-500/20" />
        
        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white hover:bg-white/5 p-2 rounded-full transition-all">
          <X size={20} />
        </button>
        
        <div className="text-center mb-6">
          <h2 className="text-white text-3xl font-extrabold tracking-tight uppercase bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-200 to-purple-400">
            {authMode === 'login' ? 'Iniciar Sesión' : 'Registro de Cuenta'}
          </h2>
          <p className="text-white/40 text-xs mt-1.5 font-sans">
            {authMode === 'login' ? 'Ingresa tus credenciales para acceder a tu cuenta.' : 'Completa la información para tu perfil formal.'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2.5 text-xs text-red-400 animate-in shake duration-200">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3.5 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-2.5 text-xs text-green-400">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}
        
        <form className="space-y-4" onSubmit={handleAuthSubmit}>
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4">
            {authMode === 'registro' ? (
              <>
                <span className="text-[10px] text-blue-400 tracking-wider font-semibold uppercase block border-b border-white/5 pb-2">Datos de Registro</span>
                <div className="space-y-3">
                  {/* Nombre completo */}
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 text-white/30" size={16} />
                    <input 
                      type="text" 
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="Nombre Completo (p. ej. Pedro Pérez)" 
                      className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white text-xs placeholder:text-white/30 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                    />
                  </div>
                  {/* Teléfono */}
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 text-white/30" size={16} />
                    <input 
                      type="tel" 
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="Número de Teléfono (p. ej. +58 412-1234567)" 
                      className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white text-xs placeholder:text-white/30 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                    />
                  </div>
                  {/* Correo */}
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 text-white/30" size={16} />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Correo Electrónico" 
                      className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white text-xs placeholder:text-white/30 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                    />
                  </div>
                  {/* Contraseña */}
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 text-white/30" size={16} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Crea tu Contraseña" 
                      className="w-full pl-10 pr-10 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white text-xs placeholder:text-white/30 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-white/40 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {/* Confirmar Contraseña */}
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 text-white/30" size={16} />
                    <input 
                      type="password" 
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Confirma tu Contraseña" 
                      className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white text-xs placeholder:text-white/30 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <span className="text-[10px] text-blue-400 tracking-wider font-semibold uppercase block border-b border-white/5 pb-2">Credenciales de Acceso</span>
                <div className="space-y-3">
                  {/* Correo */}
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 text-white/30" size={16} />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Correo Electrónico" 
                      className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white text-xs placeholder:text-white/30 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                    />
                  </div>
                  {/* Contraseña */}
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 text-white/30" size={16} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Contraseña" 
                      className="w-full pl-10 pr-10 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white text-xs placeholder:text-white/30 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-white/40 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          
          {authMode === 'login' && (
            <div className="text-right">
              <button 
                type="button" 
                onClick={handleForgotPassword}
                className="text-xs text-blue-400 hover:text-blue-300 font-sans tracking-wide hover:underline"
              >
                ¿Has olvidado tu contraseña?
              </button>
            </div>
          )}

          <button className="w-full p-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold tracking-wider transition-all duration-300 uppercase text-xs shadow-lg shadow-blue-500/20 hover:scale-[1.01] active:scale-[0.99] mt-3 cursor-pointer">
            {authMode === 'login' ? 'Acceder al Sistema' : 'Finalizar Registro'}
          </button>
        </form>



        <div className="mt-6 text-center text-xs text-white/50 border-t border-white/5 pt-4">
          {authMode === 'login' ? (
            <p>¿No tienes una cuenta todavía? <button type="button" onClick={() => { cyberSound.playClick(); setAuthMode('registro'); setErrorMsg(''); setSuccessMsg(''); }} className="text-blue-400 font-bold hover:underline transition-colors">Regístrate gratis</button></p>
          ) : (
            <p>¿Ya tienes una cuenta formal? <button type="button" onClick={() => { cyberSound.playClick(); setAuthMode('login'); setErrorMsg(''); setSuccessMsg(''); }} className="text-blue-400 font-bold hover:underline transition-colors">Inicia sesión</button></p>
          )}
        </div>
      </div>
    </div>
  );
}

