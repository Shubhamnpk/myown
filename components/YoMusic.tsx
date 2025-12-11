"use client"
export function YoMusic() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1">
        <iframe
          src="https://theyomusic.vercel.app/"
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  )
}
