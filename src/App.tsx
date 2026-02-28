import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function ScrollSyncHero() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [duration, setDuration] = useState(0)

  // Get video duration once metadata is loaded
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      if (!Number.isNaN(video.duration)) {
        setDuration(video.duration)
      }
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [])

  // Sync video currentTime to scroll position with GSAP ScrollTrigger
  useLayoutEffect(() => {
    const container = containerRef.current
    const video = videoRef.current
    if (!container || !video || !duration) return

    // Make sure native playback does not fight with GSAP
    video.pause()
    video.currentTime = 0

    const ctx = gsap.context(() => {
      // Animate the video's currentTime directly.
      gsap.to(video, {
        // from currentTime 0 -> full duration
        currentTime: duration,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          // scroll distance scales with video duration
          end: () => `+=${duration * 220}`, // increase this if you want more scroll
          scrub: true, // tight coupling so reverse works smoothly
          pin: true,
          invalidateOnRefresh: true,
        },
      })
    }, container)

    return () => {
      ctx.revert()
    }
  }, [duration])

  return (
    <section ref={containerRef} className="relative">
      <div className="relative h-screen overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full scale-[1.03] object-cover saturate-125 contrast-110"
          src="/dd.mp4"
          muted
          playsInline
          preload="metadata"
        />
        <div className="relative z-10 flex h-full items-end justify-center bg-gradient-to-t from-black/90 via-black/60 via-30% to-transparent px-6 pb-12 pt-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-neutral-200/70">
              Cinematic dining experience
            </p>
            <h1 className="text-balance text-4xl font-semibold leading-tight text-neutral-50 drop-shadow-[0_20px_60px_rgba(0,0,0,0.9)] sm:text-5xl md:text-6xl">
              Scroll to discover the restaurant.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-neutral-200/80 sm:text-base">
              The hero video scrubs as you scroll, revealing the space frame by frame
              for a dramatic, interactive first impression.
            </p>
          </div>
        </div>
      </div>
      <div className="h-[40vh]" />
    </section>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#14111b_0,_#050208_55%,_#020106_100%)] text-stone-100">
      <ScrollSyncHero />
      <section className="mx-auto max-w-5xl px-6 pb-24 pt-16">
        <h2 className="mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-neutral-200/80">
          After the hero
        </h2>
        <div className="space-y-4 text-sm leading-relaxed text-neutral-200/80 sm:text-base">
          <p>
            This is placeholder content so you have somewhere to scroll to. Replace it
            with your actual sections: menu, story, booking, or anything else you need
            for the restaurant experience.
          </p>
          <p>
            The hero above is scroll-synced with the video in the public folder and
            stays pinned while you scrub through it using the scroll position, helped
            by GSAP ScrollTrigger for smooth forward and reverse playback.
          </p>
        </div>
      </section>
    </div>
  )
}

export default App
