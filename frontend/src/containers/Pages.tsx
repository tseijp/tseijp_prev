import React, { FC, useMemo, useRef } from 'react'
import { useSprings, animated as a } from 'react-spring'
import { useDrag }    from 'react-use-gesture'
import { clamp }      from '../utils'
import { PagesProps } from '../types'

const pages = [
  'https://images.pexels.com/photos/62689/pexels-photo-62689.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/296878/pexels-photo-296878.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/1509428/pexels-photo-1509428.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/351265/pexels-photo-351265.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/924675/pexels-photo-924675.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
]

export const Pages :FC<PagesProps> = ({children}) => {
    const index = useRef(0)
    const length = children instanceof Array ? children.length :  1
    const [props, set] = useSprings(length, i => ({
        x: i * window.innerWidth,
        scale: 1,
        display: 'block'
    }))
    const styles = useMemo<React.CSSProperties[]>(()=>[
      { position:"absolute", width:"100vw", height:"100vh", willChange:"transform" },
      { backgroundSize:"cover",       width :"100%", willChange:"transform",
        backgroundRepeat:"no-repeat", height:"100%",
        backgroundPosition:"center center",
        boxShadow:"0 62.5px 125px -25px rgba(50, 50, 73, 0.5), 0 37.5px 75px -37.5px rgba(0, 0, 0, 0.6)"}
    ], [])
    const bind = useDrag(({ down, movement: [mx], direction: [xDir], distance, cancel }) => {
        if (down && cancel && distance > window.innerWidth / 2) {
            index.current = clamp(index.current + (xDir > 0 ? -1 : 1), 0, pages.length - 1)
            cancel()
        }
        set(i => {
            if (i < index.current - 1 || i > index.current + 1) return { display: 'none' }
            const x = (i-index.current) * window.innerWidth + (down ? mx : 0)
            const scale = down ? 1-distance/window.innerWidth/2 : 1
            return { x, scale, display: 'block' }
        })
    })
    return (
        <div style={styles[0]}>
            {props.map(({ x, display, scale }, i) => (
                <a.div {...bind()} key={i} style={{ ...styles[1], display, x }}>
                  <a.div style={{ scale, backgroundImage: `url(${pages[i]})` }} />
                </a.div>
            ))}
        </div>
    )
}
