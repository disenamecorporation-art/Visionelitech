import React, { useState, useMemo, useEffect } from 'react';
import { User, Phone, Mail, Lock, ShieldAlert, CheckCircle2, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { cyberSound } from './CyberSound';
import { ProductDetails } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface UserProfileProps {
  userEmail: string;
  products: ProductDetails[];
  onLogout: () => void;
  onAddToCart: (product: ProductDetails) => void;
  onNavigate: (sectionId: string) => void;
}

export default function UserProfile({ 
  userEmail, 
  products, 
  onLogout, 
  onAddToCart,
  onNavigate
}: UserProfileProps) {
  const [profileData, setProfileData] = useState<{
    fullName: string;
    email: string;
    phone: string;
    isAdmin: boolean;
  } | null>(null);

  // Load profile dynamically from Supabase if configured
  useEffect(() => {
    async function loadProfile() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .single();
            
            if (!error && profile) {
              setProfileData({
                fullName: profile.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || '',
                email: user.email || '',
                phone: profile.phone || user.user_metadata?.phone || '',
                isAdmin: !!profile.is_admin || !!user.user_metadata?.is_admin
              });
              return;
            }
          }
        } catch (err) {
          console.error("Error loading profile from Supabase:", err);
        }
      }
    }
    loadProfile();
  }, [userEmail]);

  // Find current logged user details (Supabase dynamic state OR local fallback)
  const userDetails = useMemo(() => {
    if (profileData) return profileData;

    const users = JSON.parse(localStorage.getItem('visionelitech_users') || '[]');
    const found = users.find((u: any) => u.email.toLowerCase() === userEmail.toLowerCase());
    if (found) return found;
    // Default fallback if registered user is admin or somehow missing
    return {
      fullName: userEmail.split('@')[0],
      email: userEmail,
      phone: '+58 412-0000000',
      isAdmin: userEmail.toLowerCase().includes('admin') || userEmail.toLowerCase() === 'disenamecorporation@gmail.com' || userEmail.toLowerCase() === 'visionelitech@gmail.com'
    };
  }, [userEmail, profileData]);

  // Form states for password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    cyberSound.playClick();
    setSuccessMessage('');
    setErrorMessage('');

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setErrorMessage('Por favor, completa todos los campos.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMessage('Las nuevas contraseñas no coinciden.');
      return;
    }

    if (newPassword.length < 5) {
      setErrorMessage('La nueva contraseña debe tener al menos 5 caracteres.');
      return;
    }

    // Supabase Password Update Integration
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.updateUser({
          password: newPassword
        });

        if (error) {
          setErrorMessage(error.message);
        } else {
          setSuccessMessage('¡Contraseña actualizada en Supabase con éxito!');
          setCurrentPassword('');
          setNewPassword('');
          setConfirmNewPassword('');
        }
        return;
      } catch (err: any) {
        setErrorMessage(err.message || 'Error al actualizar la contraseña.');
        return;
      }
    }

    // Try finding user in registered users
    const users = JSON.parse(localStorage.getItem('visionelitech_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.email.toLowerCase() === userEmail.toLowerCase());

    if (userIndex !== -1) {
      // Check if current password is correct
      if (users[userIndex].password !== currentPassword) {
        setErrorMessage('La contraseña actual es incorrecta.');
        return;
      }

      // Update password
      users[userIndex].password = newPassword;
      localStorage.setItem('visionelitech_users', JSON.stringify(users));
      setSuccessMessage('¡Contraseña actualizada con éxito!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } else {
      // If it's a fallback/admin, mock the update
      setSuccessMessage('¡Contraseña actualizada con éxito (Demostración local)!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    }
  };

  // Filter 3 recommended/featured products to render at the bottom of the profile
  const recommendedProducts = useMemo(() => {
    // Return up to 3 trending products or simply first 3 products
    const trending = products.filter(p => p.isTrending);
    if (trending.length > 0) return trending.slice(0, 3);
    return products.slice(0, 3);
  }, [products]);

  return (
    <div className="w-full max-w-[1290px] mx-auto px-4 md:px-0 pt-28 pb-16 min-h-screen" id="user-profile-view">
      
      {/* Title block */}
      <div className="mb-10 text-center md:text-left">
        <h2 className="font-sans font-light text-2xl md:text-3xl text-white tracking-wide uppercase">
          PANEL DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">MI PERFIL</span>
        </h2>
        <p className="font-sans text-xs text-white/50 mt-1 max-w-xl">
          Administra tus datos formales de cliente, seguridad de acceso y explora recomendaciones.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: User Info details card */}
        <div className="lg:col-span-5 bg-zinc-950/40 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-4 border-b border-white/5 pb-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-xl font-bold uppercase shadow-lg shadow-blue-500/10">
              {userDetails.fullName.slice(0, 2)}
            </div>
            <div>
              <h3 className="text-white text-lg font-bold uppercase tracking-wide">{userDetails.fullName}</h3>
              <span className="text-[10px] text-blue-400 font-mono tracking-widest uppercase bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                {userDetails.isAdmin ? '👑 Administrador' : 'Cliente Formal'}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-white/40 text-[10px] uppercase font-bold tracking-widest font-mono">Información Personal</h4>
            
            <div className="space-y-3.5">
              <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl p-3.5">
                <User size={16} className="text-blue-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[9px] text-white/40 block uppercase">Nombre Completo</span>
                  <span className="text-xs text-white/95 font-medium truncate block">{userDetails.fullName}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl p-3.5">
                <Mail size={16} className="text-blue-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[9px] text-white/40 block uppercase">Correo Registrado</span>
                  <span className="text-xs text-white/95 font-medium truncate block">{userDetails.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl p-3.5">
                <Phone size={16} className="text-blue-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[9px] text-white/40 block uppercase">Teléfono de Contacto</span>
                  <span className="text-xs text-white/95 font-medium truncate block">{userDetails.phone}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            <button 
              onClick={onLogout}
              className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500 text-red-400 text-xs font-bold tracking-wider rounded-xl uppercase transition-all duration-300 cursor-pointer"
            >
              Cerrar Sesión Activa
            </button>
          </div>
        </div>

        {/* Right column: Change Password box */}
        <div className="lg:col-span-7 bg-zinc-950/40 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h3 className="text-white text-base font-bold uppercase tracking-wide flex items-center gap-2">
              <Lock size={15} className="text-blue-400" />
              Seguridad: Cambiar Contraseña
            </h3>
            <p className="text-white/40 text-[11px] mt-1">
              Actualiza periódicamente tu contraseña para proteger tu panel de compras.
            </p>
          </div>

          {successMessage && (
            <div className="p-3.5 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-2.5 text-xs text-green-400">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2.5 text-xs text-red-400">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-3.5 bg-black/40 border border-white/10 p-5 rounded-2xl">
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-white/30" size={15} />
                <input 
                  type="password"
                  required
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Contraseña Actual"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder:text-white/30 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-white/30" size={15} />
                <input 
                  type="password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Nueva Contraseña"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder:text-white/30 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-white/30" size={15} />
                <input 
                  type="password"
                  required
                  value={confirmNewPassword}
                  onChange={e => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirmar Nueva Contraseña"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder:text-white/30 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 bg-blue-500 hover:bg-blue-400 text-black font-bold text-xs tracking-wider rounded-xl uppercase transition-all duration-300 cursor-pointer shadow-lg shadow-blue-500/10"
            >
              Actualizar Contraseña
            </button>
          </form>
        </div>

      </div>

      {/* Featured Products at the Bottom of Dashboard */}
      <div className="mt-16 border-t border-white/10 pt-12">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h3 className="font-sans font-light text-xl text-white tracking-wide uppercase">
              RECOMENDADOS <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">PARA TI</span>
            </h3>
            <p className="font-sans text-[11px] text-white/40 mt-1">
              Basado en tus preferencias tecnológicas y compras recientes.
            </p>
          </div>
          <button 
            onClick={() => onNavigate('tienda')}
            className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-bold text-xs tracking-wider uppercase transition-colors shrink-0 cursor-pointer"
          >
            Ver catálogo completo
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedProducts.map(product => (
            <div 
              key={product.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-white/5 bg-zinc-950/40 p-4 hover:border-blue-500/20 hover:bg-zinc-900/40 transition-all duration-300"
            >
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-xl bg-black/40 border border-white/5 p-1 flex items-center justify-center overflow-hidden shrink-0">
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] text-blue-400 font-bold tracking-widest uppercase block">{product.category}</span>
                  <h4 className="text-white text-sm font-medium tracking-wide uppercase truncate mt-0.5">{product.name}</h4>
                  <span className="text-blue-300 text-xs font-bold block mt-1">${product.priceUSD.toLocaleString()}</span>
                </div>
              </div>
              
              <button 
                onClick={() => onAddToCart(product)}
                className="mt-4 w-full py-2 bg-blue-500/10 hover:bg-blue-500 hover:text-black text-blue-400 text-[10px] font-bold tracking-wider rounded-lg uppercase transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ShoppingBag size={11} />
                Añadir al Carrito
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
