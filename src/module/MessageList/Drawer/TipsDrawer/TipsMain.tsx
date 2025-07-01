import { Button, Text } from '@x-vision/design'
import { Icon } from '@x-vision/icons'

interface IProps {
  name: string
}
export default function TipsMain(props: IProps) {
  const { name } = props
  return (
    <div className="w-full h-[95dvh] max-h-[95dvh] flex flex-col items-center justify-center overflow-y-auto">
      <Text size="body1" strong>
        Tip {name}
      </Text>
      <div className="h-12 w-full"></div>
      <Text size="display1">$5</Text>
      <div className="h-2 w-full"></div>
      <Text size="body2" emphasis={2}>
        Between $5 to $1000
      </Text>
      <div className="h-12 w-full"></div>
      <div className="flex justify-center max-w-[50%] flex-wrap gap-2">
        <Button>Min</Button>
        <Button>+ 5</Button>
        <Button>+ 10</Button>
        <Button>+ 100</Button>
        <Button>+ 1000</Button>
      </div>
      <div className="h-12 w-full"></div>
      <Text size="body1" strong>
        Pay with
      </Text>
      <div className="h-1 w-full"></div>
      <div className="flex items-center">
        <Icon icon="x:PaymentMethodsVisaColor" fontSize={24} />
        <div className="h-full w-2"></div>
        <Text size="body1">ending with 1234</Text>
        <div className="h-full w-1"></div>
        <Icon icon="x:Edit02StyleStroke" fontSize={12} />
      </div>
      <div className="h-9 w-full"></div>
      <Button size="great" color="primary">
        <Icon icon="x:MoneySendCircleStyleSolid" />
        Tip
      </Button>
    </div>
  )
}
