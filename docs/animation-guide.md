# MindBridge Animation Guide

Panduan lengkap untuk menggunakan animasi di website MindBridge agar lebih enak dipandang tetap clean dan aesthetic.

## 🎨 Jenis Animasi yang Tersedia

### 1. **Page Transitions**
- `animate-fade-in` - Fade in sederhana
- `animate-fade-in-up` - Fade in dengan gerakan ke atas
- `animate-slide-in-left` - Slide masuk dari kiri
- `animate-slide-in-right` - Slide masuk dari kanan
- `animate-scale-in` - Scale in dari tengah

### 2. **Hover Effects**
- `hover-lift` - Efek mengangkat saat hover
- `hover-scale` - Efek membesar saat hover

### 3. **Loading & Micro-interactions**
- `animate-float` - Animasi mengambang halus
- `animate-milo-pulse` - Pulse effect untuk avatar Milo
- `animate-danger` - Pulse effect untuk notifikasi bahaya
- `shimmer` - Efek shimmer untuk loading

### 4. **Form Interactions**
- `input-error` - Shake animation untuk error
- `input-success` - Glow effect untuk success
- `.input-group:focus-within .input-label` - Animasi label saat focus

## 🛠️ Cara Penggunaan

### Component-based Animations

```tsx
import { AnimatedWrapper } from "@/components/AnimatedWrapper";
import { AnimatedCard } from "@/components/AnimatedCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { LoadingSpinner, TypingIndicator } from "@/components/LoadingSpinner";

// AnimatedWrapper - Universal animation wrapper
<AnimatedWrapper animation="fade-in-up" delay={200}>
  <div>Konten yang akan di-animasi</div>
</AnimatedWrapper>

// AnimatedCard - Card dengan animasi built-in
<AnimatedCard hover={true} animation="scale-in" delay={100}>
  <h3>Card Title</h3>
  <p>Card content</p>
</AnimatedCard>

// ScrollReveal - Animasi saat scroll
<ScrollReveal animation="slide-in-left" threshold={0.2}>
  <section>Konten yang muncul saat scroll</section>
</ScrollReveal>

// Loading states
<LoadingSpinner size="md" variant="primary" />
<TypingIndicator />
```

### CSS Classes

```tsx
// Direct CSS classes usage
<div className="animate-fade-in-up animate-stagger-1">
  <h1>Heading</h1>
</div>

<div className="card hover-lift">
  <p>Card dengan hover effect</p>
</div>

<input className="input-pill" />
<div className="input-group">
  <label className="input-label">Email</label>
  <input className="input-pill" />
</div>
```

## 🎯 Best Practices untuk MindBridge

### 1. **Consistent Timing**
- Gunakan delay yang konsisten: 0ms, 100ms, 200ms, 300ms
- Animation duration: 0.3s - 0.4s untuk smooth transitions

### 2. **Purposeful Animations**
- Gunakan animasi untuk memberikan feedback (hover, focus, error)
- Gunakan untuk guide attention (form validation, important info)
- Hindari animasi yang mengganggu fokus

### 3. **Performance**
- Gunakan `transform` dan `opacity` untuk smooth 60fps
- Hindari animasi `width`, `height`, `margin`, `padding`

### 4. **Accessibility**
- Respek `prefers-reduced-motion` (bisa ditambahkan)
- Jangan gunakan animasi berlebihan yang bisa menyebabkan motion sickness

## 🚀 Contoh Implementasi

### Login Form dengan Animasi
```tsx
<div className="animate-fade-in-up">
  <div className="logo-area animate-stagger-1">
    <Logo />
  </div>
  
  <div className="card animate-stagger-2">
    <form>
      <div className="input-group">
        <label className="input-label">Email</label>
        <input 
          className={`input-pill ${error ? 'input-error' : ''}`}
          type="email"
        />
      </div>
      
      <button className="btn-primary hover-lift">
        {isLoading ? <LoadingSpinner /> : 'Login'}
      </button>
    </form>
  </div>
</div>
```

### Dashboard Cards dengan Staggered Animation
```tsx
<div className="grid grid-cols-3 gap-6">
  <AnimatedCard animation="fade-in-up" delay={0}>
    <StatsCard title="Total Siswa" value="120" />
  </AnimatedCard>
  
  <AnimatedCard animation="fade-in-up" delay={100}>
    <StatsCard title="Sessions" value="45" />
  </AnimatedCard>
  
  <AnimatedCard animation="fade-in-up" delay={200}>
    <StatsCard title="Alerts" value="3" />
  </AnimatedCard>
</div>
```

## 🔧 Custom Animation

### Menambahkan animation baru
```css
/* Di globals.css */
@keyframes custom-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-custom-bounce {
  animation: custom-bounce 0.6s ease;
}
```

### Custom hover effect
```css
.hover-custom {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-custom:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 12px 40px rgba(255, 107, 44, 0.2);
}
```

## 📱 Mobile Considerations

- Animasi di mobile harus lebih subtle
- Gunakan `will-change: transform` untuk smooth mobile animations
- Test di berbagai device untuk performance

## 🎨 Color Integration

Animasi menggunakan color scheme MindBridge:
- Primary: `#FF6B2C` (orange)
- Accent: `#FFD23F` (yellow)  
- Success: `#16A34A` (green)
- Danger: `#DC2626` (red)
- Background: `#FFF8F6` (warm white)

---

**Tip:** Mulai dengan animasi yang subtle, tambahkan secara bertahap berdasarkan user feedback. Animasi harus meningkatkan UX, bukan mengganggu!
