import { forwardRef, memo, Ref, SVGProps } from 'react'

const GoogleIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    fill={'none'}
    height={'40'}
    ref={ref}
    viewBox={'0 0 48 48'}
    width={'40'}
    xmlns={'http://www.w3.org/2000/svg'}
    {...props}
  >
    <defs>
      <clipPath id={'google-icon_svg__a'}>
        <rect
          fill={'#fff'}
          fillOpacity={0}
          height={47}
          rx={0.5}
          transform={'translate(.5 .5)'}
          width={47}
        />
      </clipPath>
    </defs>
    <rect fill={'none'} height={47} rx={0.5} transform={'translate(.5 .5)'} width={47} />
    <g clipPath={'url(#google-icon_svg__a)'} fillRule={'evenodd'}>
      <path
        d={
          'M10.32 24c0-1.53.26-2.99.71-4.36L3.12 13.6A23.5 23.5 0 0 0 .71 24c0 3.73.87 7.26 2.41 10.38l7.9-6.05c-.45-1.36-.7-2.82-.7-4.33'
        }
        fill={'#FBBC05'}
      />
      <path
        d={
          'M24.21 10.13c3.31 0 6.3 1.17 8.65 3.09l6.84-6.83C35.53 2.77 30.19.53 24.21.53 14.92.53 6.94 5.84 3.12 13.6l7.91 6.04c1.82-5.53 7.01-9.51 13.18-9.51'
        }
        fill={'#EB4335'}
      />
      <path
        d={
          'M24.21 37.86c-6.17 0-11.36-3.98-13.18-9.51l-7.91 6.04a23.42 23.42 0 0 0 21.09 13.07c5.73 0 11.2-2.03 15.31-5.85l-7.51-5.8c-2.12 1.33-4.78 2.05-7.8 2.05'
        }
        fill={'#34A853'}
      />
      <path
        d={
          'M46.64 24c0-1.39-.21-2.88-.53-4.27h-21.9v9.07h12.6c-.63 3.09-2.34 5.46-4.8 7.01l7.51 5.8c4.31-4 7.12-9.97 7.12-17.61'
        }
        fill={'#4285F4'}
      />
    </g>
  </svg>
)
const ForwardRef = forwardRef(GoogleIcon)
const Memo = memo(ForwardRef)

export default Memo
