import CommonCarousel, { CommonCarouselRef } from '@/components/CommonCarousel'
import { STATIC_SOURCE_URL } from '@/constants'
import { Avatar, Button, CarouselItem, Loading, Text } from '@x-vision/design/index.js'
import React, { useRef } from 'react'
import Image from 'next/image'
import { use100vh } from 'react-div-100vh'
import { Icon } from '@x-vision/icons/index.js'
import { useSize } from 'ahooks'

interface Iprops {
  onCreate: () => void
}
function Introduction(props: Iprops) {
  const { onCreate } = props
  const carouselRef = useRef<CommonCarouselRef>(null)
  const fullHeight = use100vh() || 0
  const maskRef = useRef<HTMLDivElement>(null)
  const size = useSize(maskRef)

  const IntroductionList = [
    {
      title: 'Engage fans who discover you through social media with chat hooks',
      videoSrc: `${STATIC_SOURCE_URL}/videos/social-media.mp4`,
    },
    {
      title: `Once the chat gets going, AI takes over the conversation and continues engaging your fans intimately`,
      videoSrc: `${STATIC_SOURCE_URL}/videos/ai-take-over.mp4`,
    },
    {
      title: 'Step 1',
      content: 'Craft the message that fans see once they enter the chat',
      videoSrc: `${STATIC_SOURCE_URL}/videos/create-chat-hook.mp4`,
    },
    {
      title: 'Step 2',
      content: 'Generate a link to share on social media with your fans',
      videoSrc: `${STATIC_SOURCE_URL}/videos/share.mp4`,
    },
    {
      title: 'Ready to try using chat hooks?',
    },
  ]

  return (
    <div className="p-(--sizing-named-small)">
      <CommonCarousel
        ref={carouselRef}
        preButton={
          <Button onClick={() => carouselRef.current?.onPreClick()} variant="text">
            <Icon icon="x:ArrowLeft02StyleSolid" color="var(--element-emphasis-00)" />
            <Text size="body1" strong>
              Back
            </Text>
          </Button>
        }
        nextButton={<Button onClick={() => carouselRef.current?.onNextClick()}>Next</Button>}
      >
        {IntroductionList.map((item, index) => (
          <CarouselItem key={index}>
            <div className="flex flex-col">
              {item.title && (
                <Text size="heading3" className="py-(--sizing-named-small) text-(--element-emphasis-00)">
                  {item.title}
                </Text>
              )}
              {item.content && (
                <Text size="body1" className="text-(--element-emphasis-00)">
                  {item.content}
                </Text>
              )}
              <div
                ref={maskRef}
                style={{
                  height: fullHeight * 0.4,
                }}
                className="relative my-(--sizing-named-huge) w-full rounded-(--sizing-named-micro) bg-(--surface-level-02-emphasis-00)"
              >
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-[-1]">
                  <Loading />
                </div>
                {index !== IntroductionList.length - 1 && (
                  <video
                    src={item.videoSrc}
                    autoPlay
                    muted
                    playsInline
                    webkit-playsinline="true"
                    loop
                    className="w-full h-full object-cover"
                  />
                )}
                {index === IntroductionList.length - 1 && (
                  <Avatar
                    src={`${STATIC_SOURCE_URL}/images/preview.png`}
                    alt=""
                    className="w-full h-full object-cover rounded-none absolute"
                    style={{
                      height: fullHeight * 0.4,
                      width: size?.width,
                    }}
                  />
                )}
              </div>
              {index === IntroductionList.length - 1 && (
                <div className="flex justify-center">
                  <Button color="primary" onClick={onCreate}>
                    Create a chat hook
                  </Button>
                </div>
              )}
            </div>
          </CarouselItem>
        ))}
      </CommonCarousel>
    </div>
  )
}

export default Introduction
