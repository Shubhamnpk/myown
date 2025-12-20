'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { saveUser, setCurrentUser } from '@/utils/userManagement';
import { useThemeStore } from '@/hooks/use-theme-store';
import {
  Sun,
  Moon,
  Laptop,
  User,
  Check,
  Camera,
  Sparkles,
  ChevronRight,
  Palette,
  Mail,
  Lock,
  UserCheck,
  Eye,
  EyeOff
} from 'lucide-react';

const accentColors = [
  { value: 'default', color: 'bg-gray-500', name: 'Default' },
  { value: 'purple', color: 'bg-purple-500', name: 'Purple' },
  { value: 'blue', color: 'bg-blue-500', name: 'Blue' },
  { value: 'green', color: 'bg-green-500', name: 'Green' },
  { value: 'red', color: 'bg-red-500', name: 'Red' },
  { value: 'orange', color: 'bg-orange-500', name: 'Orange' },
  { value: 'pink', color: 'bg-pink-500', name: 'Pink' },
  { value: 'teal', color: 'bg-teal-500', name: 'Teal' },
  { value: 'yellow', color: 'bg-yellow-500', name: 'Yellow' },
];


const steps = [
  {
    id: 0,
    title: 'Welcome to MyOwn',
    description: 'Your personal productivity journey starts here',
    icon: Sparkles,
  },
  {
    id: 1,
    title: 'Create Your Account',
    description: 'Set up your login credentials and profile',
    icon: UserCheck,
  },
  {
    id: 2,
    title: 'Customize Your Experience',
    description: 'Make it yours',
    icon: Palette,
  },
  {
    id: 3,
    title: 'Review & Confirm',
    description: 'Ready to get started?',
    icon: Check,
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const { theme, accentColor, setTheme, setAccentColor } = useThemeStore();

  // Account details
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile
  const [name, setName] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  // Preferences
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'system'>(theme);
  const [selectedAccentColor, setSelectedAccentColor] = useState(accentColor || 'default');

  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 25;
    if (/[^a-zA-Z\d]/.test(password)) strength += 25;
    return Math.min(strength, 100);
  };

  const getStrengthLabel = (strength: number) => {
    if (strength < 25) return 'Very Weak';
    if (strength < 50) return 'Weak';
    if (strength < 75) return 'Fair';
    return 'Strong';
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (currentStep === 1) {
      if (!email.trim()) {
        newErrors.email = 'Please enter your email';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = 'Please enter a valid email';
        isValid = false;
      }
      if (!password.trim()) {
        newErrors.password = 'Please enter a password';
        isValid = false;
      } else {
        const strength = calculatePasswordStrength(password);
        if (strength < 75) {
          newErrors.password = 'Password is too weak! Please choose a stronger password.';
          isValid = false;
        }
      }
      
      if (!confirmPassword.trim()) {
        newErrors.confirmPassword = 'Please confirm your password';
        isValid = false;
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }
      
      if (!name.trim()) {
        newErrors.name = 'Please enter your name';
        isValid = false;
      } else if (name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
        isValid = false;
      }
    }


    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Finish registration
      setTheme(selectedTheme);
      setAccentColor(selectedAccentColor);
      const generatedUsername = name.toLowerCase().replace(/\s+/g, '') + Math.random().toString(36).substr(2, 4);
      const newUser = saveUser({
        name,
        email,
        username: generatedUsername,
        password,
        profilePic: profilePicture,
        theme: selectedTheme,
        accentColor: selectedAccentColor,
      });
      setCurrentUser(newUser);
      router.push('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setErrors({});
      setCurrentStep(currentStep - 1);
    }
  };

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          setProfilePicture(result);
          setFileInputKey(Date.now());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return true;
      case 1:
        return email.trim() &&
               password.trim() &&
               confirmPassword.trim() &&
               password === confirmPassword &&
               calculatePasswordStrength(password) >= 75 &&
               /\S+@\S+\.\S+/.test(email) &&
               name.trim() &&
               name.length >= 2;
      case 2:
        return true;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return true;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex flex-col">
      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-muted">
        <motion.div
          className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Step Indicator Dots */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <motion.div
                    className={cn(
                      'relative w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-semibold transition-all',
                      index <= currentStep
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'bg-muted text-muted-foreground'
                    )}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
                  >
                    {index < currentStep ? (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                      >
                        <Check className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      index + 1
                    )}
                    {index === currentStep && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-primary"
                        initial={{ scale: 1, opacity: 0 }}
                        animate={{ scale: 1.4, opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
                      />
                    )}
                  </motion.div>
                  {index < steps.length - 1 && (
                    <motion.div
                      className={cn(
                        'w-8 h-1 rounded-full mx-1 transition-colors',
                        index < currentStep ? 'bg-primary' : 'bg-muted'
                      )}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="space-y-6"
            >
              {/* Step 0: Welcome */}
              {currentStep === 0 && (
                <div className="text-center space-y-6 py-8">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
                    className="mx-auto w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gradient-to-br from-primary to-primary/60 rounded-3xl flex items-center justify-center shadow-2xl"
                  >
                    <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-primary-foreground" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      Welcome to MyOwn
                    </h1>
                    <p className="text-muted-foreground mt-3 text-sm sm:text-base md:text-lg max-w-md mx-auto">
                      Your personal productivity dashboard. Let's set up your account and customize your experience.
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center justify-center gap-2 pt-4"
                  >
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      <span>Quick 4-step setup</span>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Step 1: Account Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Create Your Account</h2>
                    <p className="text-muted-foreground mt-2 text-sm sm:text-base">Set up your login credentials and profile</p>
                  </div>

                  <div className="space-y-6 max-w-md mx-auto">
                    <div className="flex flex-col items-center space-y-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
                        className="relative group"
                      >
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-4 border-primary/20 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/40">
                          {profilePicture ? (
                            <img
                              src={profilePicture}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground" />
                          )}
                        </div>
                        <label
                          htmlFor="profile-picture"
                          className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:scale-110 transition-transform shadow-lg"
                        >
                          <Camera className="w-4 h-4" />
                          <input
                            id="profile-picture"
                            type="file"
                            accept="image/*"
                            key={fileInputKey}
                            onChange={handleProfilePictureUpload}
                            className="sr-only"
                          />
                        </label>
                      </motion.div>

                      <div className="w-full max-w-sm space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                          Full Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            setErrors({ ...errors, name: '' });
                          }}
                          placeholder="Enter your full name"
                          className={cn(
                            "text-center text-sm sm:text-base h-12",
                            errors.name && "border-destructive focus-visible:ring-destructive"
                          )}
                          autoFocus
                        />
                        {errors.name && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-destructive text-center"
                          >
                            {errors.name}
                          </motion.p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email Address <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setErrors({ ...errors, email: '' });
                          }}
                          placeholder="your@email.com"
                          className={cn(
                            "h-12 text-sm sm:text-base",
                            errors.email && "border-destructive focus-visible:ring-destructive"
                          )}
                        />
                        {errors.email && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-destructive"
                          >
                            {errors.email}
                          </motion.p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium">
                          Password <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              setPasswordStrength(calculatePasswordStrength(e.target.value));
                              setErrors({ ...errors, password: '' });
                            }}
                            placeholder="Choose a secure password"
                            className={cn(
                              "h-12 text-sm sm:text-base pr-10",
                              errors.password && "border-destructive focus-visible:ring-destructive"
                            )}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        {errors.password && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-destructive"
                          >
                            {errors.password}
                          </motion.p>
                        )}
                        {password && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span>Password Strength</span>
                              <span className={cn(
                                "font-medium",
                                passwordStrength < 25 ? "text-red-500" :
                                passwordStrength < 50 ? "text-orange-500" :
                                passwordStrength < 75 ? "text-yellow-500" : "text-green-500"
                              )}>
                                {getStrengthLabel(passwordStrength)}
                              </span>
                            </div>
                            <Progress
                              value={passwordStrength}
                              className="h-2"
                            />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium">
                          Confirm Password <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                              setErrors({ ...errors, confirmPassword: '' });
                            }}
                            placeholder="Confirm your password"
                            className={cn(
                              "h-12 text-sm sm:text-base pr-10",
                              errors.confirmPassword && "border-destructive focus-visible:ring-destructive"
                            )}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        {errors.confirmPassword && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-destructive"
                          >
                            {errors.confirmPassword}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Preferences */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                      className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl bg-primary/10 mb-4"
                    >
                      <Palette className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-primary" />
                    </motion.div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Customize Your Experience</h2>
                    <p className="text-muted-foreground mt-2 text-sm sm:text-base">Make it yours</p>
                  </div>

                  <div className="space-y-6 max-w-md mx-auto">
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold">Theme</h3>
                      <RadioGroup
                        value={selectedTheme}
                        onValueChange={(value: 'light' | 'dark' | 'system') => setSelectedTheme(value)}
                        className="grid grid-cols-3 gap-3"
                      >
                        {[
                          { value: 'light', icon: Sun, label: 'Light' },
                          { value: 'dark', icon: Moon, label: 'Dark' },
                          { value: 'system', icon: Laptop, label: 'System' },
                        ].map(({ value, icon: Icon, label }) => (
                          <motion.label
                            key={value}
                            htmlFor={value}
                            className={cn(
                              'relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all',
                              selectedTheme === value
                                ? 'border-primary shadow-xl ring-4 ring-primary/20 scale-105'
                                : 'border-muted hover:border-primary/50 hover:shadow-lg'
                            )}
                            whileHover={{ scale: selectedTheme === value ? 1.05 : 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <RadioGroupItem value={value} id={value} className="sr-only" />
                            <Icon className="w-6 h-6 mb-2 text-muted-foreground" />
                            <span className="text-sm font-semibold">{label}</span>
                            {selectedTheme === value && (
                              <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg"
                              >
                                <Check className="w-4 h-4 text-primary-foreground" />
                              </motion.div>
                            )}
                          </motion.label>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold">Accent Color</h3>
                        <span className="text-xs text-muted-foreground capitalize">{selectedAccentColor}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-3">
                        {accentColors.map(({ value, color, name }) => (
                          <motion.button
                            key={value}
                            onClick={() => setSelectedAccentColor(value)}
                            className="group relative flex flex-col items-center gap-1"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            title={name}
                          >
                            <div
                              className={cn(
                                'relative w-10 h-10 rounded-lg border-2 transition-all shadow-sm',
                                color,
                                selectedAccentColor === value
                                  ? 'border-foreground ring-2 ring-primary/20 scale-110'
                                  : 'border-transparent hover:border-foreground/30'
                              )}
                            >
                              {selectedAccentColor === value && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute inset-0 flex items-center justify-center"
                                >
                                  <Check className="w-5 h-5 text-white drop-shadow-lg" />
                                </motion.div>
                              )}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>


                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 150 }}
                      className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-primary to-primary/60 mb-4 shadow-xl"
                    >
                      <Check className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary-foreground" />
                    </motion.div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">You're All Set!</h2>
                    <p className="text-muted-foreground mt-2 text-sm sm:text-base md:text-lg">Review your information and start your journey</p>
                  </div>

                  <div className="space-y-4 max-w-md mx-auto">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex items-center gap-4 p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 flex-shrink-0 overflow-hidden">
                        {profilePicture ? (
                          <img
                            src={profilePicture}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base sm:text-lg truncate">{name}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">@{name.toLowerCase().replace(/\s+/g, '') + '****'}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Mail className="w-3 h-3" />
                          {email}
                        </p>
                      </div>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-3">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-3 bg-muted/50 rounded-xl"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {selectedTheme === 'light' ? <Sun className="w-4 h-4 text-muted-foreground" /> :
                           selectedTheme === 'dark' ? <Moon className="w-4 h-4 text-muted-foreground" /> :
                           <Laptop className="w-4 h-4 text-muted-foreground" />}
                          <span className="text-xs text-muted-foreground">Theme</span>
                        </div>
                        <span className="text-sm font-semibold capitalize">{selectedTheme}</span>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-3 bg-muted/50 rounded-xl"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={cn(
                            "w-4 h-4 rounded-full",
                            accentColors.find(c => c.value === selectedAccentColor)?.color
                          )} />
                          <span className="text-xs text-muted-foreground">Color</span>
                        </div>
                        <span className="text-sm font-semibold capitalize">{selectedAccentColor}</span>
                      </motion.div>


                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-center justify-center gap-2 p-4 bg-primary/5 rounded-xl mt-4"
                    >
                      <Check className="w-4 h-4 text-primary" />
                      <p className="text-sm text-muted-foreground">
                        Ready to start your productivity journey?
                      </p>
                    </motion.div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-between items-center mt-8 pt-6 border-t"
          >
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="gap-2 hover:bg-muted"
            >
              Back
            </Button>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Step {currentStep + 1} of 4</span>
              <ChevronRight className="w-4 h-4" />
            </div>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="min-w-[100px]"
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
