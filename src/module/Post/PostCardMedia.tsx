import { AspectRatio, AudioPlayerView, Avatar, Badge, cln } from '@x-vision/design'
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react'
import { Mousewheel, Pagination } from 'swiper/modules'
import { Icon } from '@x-vision/icons'
import { useMemo, useRef, useState } from 'react'
import RetryImg from '@/components/RetryImg'

import { Preview } from '@/npm/x-utils-rc'

export interface IPostCardMedia {
  type: 'image' | 'video'
  src: string
}

export default function PostCardMedia({
  media,
  onSwiper,
  onSlideChange,
  ...props
}: { media?: IPostCardMedia[] } & React.ComponentProps<typeof Swiper> & React.ComponentProps<typeof Avatar>) {
  const imageCount = useMemo(() => media?.filter((item) => item.type === 'image')?.length || 0, [media])
  const videoCount = useMemo(() => media?.filter((item) => item.type === 'video')?.length || 0, [media])

  const swiperRef = useRef<any>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [totalSlides, setTotalSlides] = useState(0)
  const [open, setOpen] = useState(false)

  if (!media?.length) return null
  return (
    <div className="relative">
      <Preview open={open} onOpenChange={setOpen} slides={media} initialSlide={activeIndex} />

      <AspectRatio className="relative max-w-[720px] max-h-[720px] ">
        <div className="typography-text-body2-strong absolute inset-(--named-small) z-9 pointer-events-none">
          {/* count */}
          <Badge size="moderate" color="primary" className="absolute top-0 right-0">
            <div className="flex gap-(--named-micro)">
              {videoCount > 0 && (
                <div className="flex gap-(--named-nano)">
                  <Icon icon="x:PlayCircleStyleStroke" fontSize={16} />
                  <span>{videoCount}</span>
                </div>
              )}
              {imageCount > 0 && (
                <div className="flex gap-(--named-nano)">
                  <Icon icon="x:Image01StyleStroke" fontSize={16} />
                  <span>{imageCount}</span>
                </div>
              )}
            </div>
          </Badge>
          {/*  */}
        </div>
        <Swiper
          className="size-full"
          loop={false}
          direction={'horizontal'}
          mousewheel={true}
          modules={[Mousewheel, Pagination]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper
            setTotalSlides(swiper.slides.length || media?.length || 0)
            onSwiper?.(swiper)
            setActiveIndex(swiper.activeIndex)
          }}
          onSlideChangeTransitionEnd={(swiper) => {
            // findAllVideoAndStop()
            setActiveIndex(swiper.activeIndex)
            onSlideChange?.(swiper)
          }}
        >
          {media?.map((slide, index) => (
            <SwiperSlide
              className="size-full flex items-center justify-center select-none bg-black"
              key={index}
              data-type={slide.type}
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                setOpen(true)
              }}
            >
              <SlideContent {...slide} />
            </SwiperSlide>
          ))}
        </Swiper>
      </AspectRatio>
      {totalSlides > 1 && (
        <CustomPagination current={activeIndex} total={totalSlides} slideTo={(i) => swiperRef.current?.slideTo?.(i)} />
      )}
    </div>
  )
}

/**
 * 轮播内容
 */
function SlideContent({ ...props }) {
  if (props.loading) return <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
  if (props.render) return props.render

  return (
    <>
      {props.type === 'image' && <RetryImg src={props.src} loading="lazy" className="size-full" {...props} />}
      {props.type === 'video' && <MediaVideo src={props.src} {...props} />}
    </>
  )
}

function MediaVideo({ src, className, ...props }: React.ComponentProps<'video'>) {
  return (
    <video
      data-slot="video"
      src={src}
      autoPlay
      disablePictureInPicture
      playsInline
      controls={false}
      webkit-playsinline="true"
      x-webkit-airplay="true"
      x5-video-player-type="h5"
      controlsList="nodownload"
      className={cln('video-element aspect-video size-full poster:object-cover', className)}
      // poster="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
      {...props}
    />
  )
}

/**
 * 自定义分页器
 * @param current 当前索引
 * @param total 总数
 * @param slideTo 切换到指定索引
 */
function CustomPagination({
  current,
  total,
  slideTo,
}: {
  current: number
  total: number
  slideTo?: (index: number) => void
}) {
  return (
    <div className="flex items-center justify-center pt-(--named-micro) gap-(--named-micro)">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={cln('size-[8px] rounded-full bg-(--element-action-primary-emphasis-03)', {
            'bg-(--element-action-primary-emphasis-00)': index === current,
          })}
          onClick={() => slideTo?.(index)}
        ></div>
      ))}
    </div>
  )
}
