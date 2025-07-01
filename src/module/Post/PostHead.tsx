import { Navbar } from '@x-vision/design'
import Logo from '@/components/Logo/logo'

export default function PostHead(props: React.ComponentProps<typeof Navbar>) {
  return (
    <Navbar
      left={<Logo>Links</Logo>}
      {...props}
      right={props?.right && <span className="mr-(--sizing-named-small)">{props?.right}</span>}
    />
  )
}
