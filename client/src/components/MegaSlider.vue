<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  slides: {
    type: Array,
    required: true
  }
})

const idx = ref(0)
let timer = null

const next = () => {
  if (props.slides.length) {
    idx.value = (idx.value + 1) % props.slides.length
  }
}

onMounted(() => {
  timer = setInterval(next, 4000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="mega-slider" v-if="slides && slides.length">
    <div class="slide-wrap">
      <transition-group name="fade-bg" tag="div" class="slides-bg-container">
        <div v-for="(sl, i) in slides" :key="'bg-'+(sl.id || i)" v-show="idx === i" class="slide-bg">
          <img :src="sl.image" :alt="sl.title" />
          <div class="shade-overlay"></div>
        </div>
      </transition-group>
      <transition-group name="slide-text" tag="div" class="slides-text-container">
        <div v-for="(sl, i) in slides" :key="'txt-'+(sl.id || i)" v-show="idx === i" class="slide-content">
          <div class="slide-caption">
            <span class="slide-tag">Featured</span>
            <h4>{{ sl.title }}</h4>
            <p>{{ sl.subtitle }}</p>
            <a :href="sl.cta_link || '#'" class="slide-cta">{{ sl.cta_label }} →</a>
          </div>
        </div>
      </transition-group>
      <div class="slide-dashes">
        <button
          v-for="(_, i) in slides"
          :key="'dash-'+i"
          class="s-dash"
          :class="{ active: idx === i }"
          @click="idx = i"
        ></button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mega-slider { padding: 1.5rem; display: flex; flex-direction: column; justify-content: center; width: 100%; height: 100%; min-height: 260px; box-sizing: border-box; }
.slide-wrap { position: relative; border-radius: 12px; overflow: hidden; background: var(--bg-surface); height: 260px; width: 100%; display: block; }
.slides-bg-container, .slides-text-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
.slide-bg, .slide-content { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
.slide-bg img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 7s ease;
}
.slide-bg:hover img { transform: scale(1.06); }
.shade-overlay {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(135deg, rgba(79,110,247,0.3) 0%, rgba(15,23,42,0.85) 100%);
  mix-blend-mode: multiply;
  z-index: 1;
}
.shade-overlay::after {
  content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 60%);
  z-index: 2;
}
.slide-caption {
  position: absolute; bottom: 0; left: 0; right: 0; width: 100%;
  padding: 1.5rem 1.5rem 2rem; box-sizing: border-box;
  color: white; z-index: 10;
}
.slide-tag {
  display: inline-block;
  background: var(--accent-primary);
  color: white; font-size: 0.65rem; font-weight: 700;
  padding: 0.25rem 0.7rem; border-radius: 100px;
  text-transform: uppercase; letter-spacing: 0.06em;
  margin-bottom: 0.6rem;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}
.slide-caption h4 { font-size: 1.15rem; font-weight: 800; margin-bottom: 0.3rem; text-shadow: 0 2px 8px rgba(0,0,0,0.5); }
.slide-caption p { font-size: 0.82rem; opacity: 0.9; margin-bottom: 0.8rem; line-height: 1.4; text-shadow: 0 1px 4px rgba(0,0,0,0.5); }
.slide-cta {
  font-size: 0.8rem; font-weight: 700; color: white;
  text-decoration: none; border-bottom: 2px solid rgba(255,255,255,0.4);
  transition: border-color 0.2s; padding-bottom: 2px;
}
.slide-cta:hover { border-color: white; }

.slide-dashes {
  display: flex; justify-content: center; gap: 6px;
  position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%);
  z-index: 20; width: 100%;
}
.s-dash {
  width: 18px; height: 3px; border-radius: 3px;
  background: rgba(255,255,255,0.4); border: none; cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); padding: 0;
}
.s-dash:hover { background: rgba(255,255,255,0.8); }
.s-dash.active { background: white; width: 34px; box-shadow: 0 0 8px rgba(255,255,255,0.5); }

.fade-bg-enter-active, .fade-bg-leave-active { transition: opacity 0.8s ease; }
.fade-bg-enter-from, .fade-bg-leave-to { opacity: 0; }

.slide-text-enter-active { transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, opacity 0.6s ease 0.1s; }
.slide-text-leave-active { transition: transform 0.4s ease, opacity 0.4s ease; }
.slide-text-enter-from { opacity: 0; transform: translateY(15px); }
.slide-text-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
