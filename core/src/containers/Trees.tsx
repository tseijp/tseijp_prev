// This is a fork of
//     https://github.com/drcmda/react-animated-tree/blob/master/src/index.js
//     https://github.com/drcmda/react-animated-tree/blob/master/src/icons.js
// demo: https://codesandbox.io/embed/rrw7mrknyp
//     content, Name of the node (string or React-component)
//     type, optional description, good for displaying icons, too (string or React-component)
//     open, optional: default open state
//     canHide, optional: when set true displays an eye icon
//     visible, optional: default visible state
//     onClick, optional: click events on the eye
//     springConfig, optional: react-spring animation config
// code
//     import Tree from 'react-animated-tree'
//     <Tree content="Apple" type="Fruit" open canHide visible onClick={console.log}>
//       <Tree content="Contents">
//         <Tree content="Seeds" />
//       <Tree>
//     <Tree>
// to
//     <Trees type="Fruit" open canHide visible onClick={}>
//         <>➊</>
//         <>
//             <>➋</>
//             <>➋ - ➊</>
//             <>➋ - ➋</>
//         </>
//     </Trees>
// prop
//     static defaultProps = { open: false, visible: true, canHide: false }
//     static propTypes = {
//       open: PropTypes.bool,
//       visible: PropTypes.bool,
//       canHide: PropTypes.bool,
//       content: PropTypes.node,
//       springConfig: PropTypes.func,
//     }

import React, {
    CSSProperties as CSS, FC, //Children,
    useMemo, useCallback, useState, useEffect, //useRef
} from 'react'
import {Spring, config, animated as a} from 'react-spring'

const styles:{[key:string]:CSS} = {
    tree: {
        padding: '4px 0px 0px 0px',
        overflow: 'hidden',
        position: 'relative',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        verticalAlign: 'middle',
    },
    toggle: {
        width: '1em',
        height: '1em',
        cursor: 'pointer',
        verticalAlign: 'middle',
        marginRight: 10,
    },
    type: {
        fontSize: '0.6em',
        fontFamily: 'monospace',
        verticalAlign: 'middle',
        textTransform: 'uppercase',
    },
    contents: {
        padding: '4px 0px 0px 14px',
        willChange: 'transform, opacity, height',
        borderLeft: '1px dashed rgba(255,255,255,0.4)',
        marginLeft: 6,
    },
}

const Icons:{[key:string]:FC<{style:CSS,onClick:()=>void,className:string}>} = {
    MinusSquareO: props => (
      <svg {...props} viewBox="64 -65 897 897">
        <g>
          <path
            d="M888 760v0v0v-753v0h-752v0v753v0h752zM888 832h-752q-30 0 -51 -21t-21 -51v-753q0 -29 21 -50.5t51 -21.5h753q29 0 50.5 21.5t21.5 50.5v753q0 30 -21.5 51t-51.5 21v0zM732 347h-442q-14 0 -25 10.5t-11 25.5v0q0 15 11 25.5t25 10.5h442q14 0 25 -10.5t11 -25.5v0
      q0 -15 -11 -25.5t-25 -10.5z"
          />
        </g>
      </svg>
    ),
    PlusSquareO: props => (
      <svg {...props} viewBox="64 -65 897 897">
        <g>
          <path
            d="M888 760v0v0v-753v0h-752v0v753v0h752zM888 832h-752q-30 0 -51 -21t-21 -51v-753q0 -29 21 -50.5t51 -21.5h753q29 0 50.5 21.5t21.5 50.5v753q0 30 -21.5 51t-51.5 21v0zM732 420h-184v183q0 15 -10.5 25.5t-25.5 10.5v0q-14 0 -25 -10.5t-11 -25.5v-183h-184
      q-15 0 -25.5 -11t-10.5 -25v0q0 -15 10.5 -25.5t25.5 -10.5h184v-183q0 -15 11 -25.5t25 -10.5v0q15 0 25.5 10.5t10.5 25.5v183h184q15 0 25.5 10.5t10.5 25.5v0q0 14 -10.5 25t-25.5 11z"
          />
        </g>
      </svg>
    ),
    EyeO: props => (
      <svg {...props} viewBox="61 51 902 666">
        <g>
          <path
            d="M963 384q0 14 -21 62q-26 65 -61 109q-57 71 -139 112q-99 50 -230 50t-231 -50q-80 -41 -138 -112q-34 -43 -61 -109q-21 -48 -21 -62v0v0v0v0q0 -14 21 -62q27 -66 61 -109q57 -71 139 -112q100 -50 230 -50t230 50q81 41 139 112q35 44 62 109q20 48 20 62v0v0v0v0z
      M889 384q-25 -77 -64 -126h-1q-46 -59 -114 -93q-85 -42 -198.5 -42t-198.5 42q-67 34 -114 93q-40 49 -65 126q25 77 65 126q47 59 114 93q85 43 199 43t198 -43q67 -33 114 -93q40 -49 65 -126zM512 558q-72 0 -122.5 -50.5t-50.5 -122.5t50.5 -122.5t122.5 -50.5
      t122.5 50.5t50.5 122.5t-50.5 122.5t-122.5 50.5zM614 385q0 -42 -30 -72t-72 -30t-72 30t-30 72t30 72t72 30t72 -30t30 -72z"
          />
        </g>
      </svg>
    ),
    CloseSquareO: props => (
      <svg {...props} viewBox="64 -65 897 897">
        <g>
          <path
            d="M717.5 589.5q-10.5 10.5 -25.5 10.5t-26 -10l-154 -155l-154 155q-11 10 -26 10t-25.5 -10.5t-10.5 -25.5t11 -25l154 -155l-154 -155q-11 -10 -11 -25t10.5 -25.5t25.5 -10.5t26 10l154 155l154 -155q11 -10 26 -10t25.5 10.5t10.5 25t-11 25.5l-154 155l154 155
      q11 10 11 25t-10.5 25.5zM888 760v0v0v-753v0h-752v0v753v0h752zM888 832h-752q-30 0 -51 -21t-21 -51v-753q0 -29 21 -50.5t51 -21.5h753q29 0 50.5 21.5t21.5 50.5v753q0 30 -21.5 51t-51.5 21v0z"
          />
        </g>
      </svg>
    )
}

const Contents:FC = ({ children, ...style }) => (
    <a.div style={{ ...style, ...styles.contents }}>
        {children}
    </a.div>
)

export const Trees:FC<Partial<{
    open:boolean, visible:boolean, immediate:boolean,
    canHide:boolean, content:any, springConfig:any, style:CSS, type:any
}>> = ({
    open=false, visible=true, immediate=false, children, ...props
}) =>  {
    // ********** props and state **********
    const [state, set] = useState<{[key:string]:boolean}>({open,visible,immediate})
    const Icon = useMemo(() => Icons[`${ children
            ? (state.open ? 'Minus' : 'Plus')
            : 'Close'
        }SquareO`], [children, state.open])
    const toggle = useCallback(() => {
        children && set(p => ({open:!p.open, immediate:false}))
    }, [children])
    const toggleVisibility = useCallback(() => {
        set(p => ({open:p.open, visible:p.visible, immediate:true}))
    }, [])
    // ********** effect **********
    // componentWillReceiveProps(props) {
    //   this.setState(state => {
    //     return ['open', 'visible'].reduce(
    //       (acc, val) =>
    //         this.props[val] !== props[val] ? { ...acc, [val]: props[val] } : acc,
    //       {}
    //     )
    //   })
    // }
    useEffect(() => {
        console.log('useEffect in Trees')
        // set(p => ['open'. 'visible'].reduce((acc, key) => ))
    }, [])
    // children = Children.map(children, child => {
    //     const grand = Children.toArray((child as any)?.props?.children) || []
    //     return grand.length <= 1
    //       ? child
    //       : <Trees content={grand.slice(0)}>grand.slice(1)</Trees>
    // })
    // ********** render **********
    return (
        <div style={{...styles.tree, ...props.style}} className="treeview">
          <Icon
            style={{...styles.toggle, opacity: children ? 1 : 0.3 } as CSS}
            onClick={toggle}
            className="toggle"
          />
          <span style={{...styles.type, marginRight: props.type ? 10 : 0 } as CSS}>
            {props.type}
          </span>
          {props.canHide &&
            <Icons.EyeO
              style={{...styles.toggle, opacity: state.visible ? 1 : 0.4 } as CSS}
              onClick={toggleVisibility}
              className="toggle"
            /> }
          <span style={{ verticalAlign: 'middle' }}>{props.content}</span>
          <Spring native immediate={state.immediate} render={Contents}
            config={{
                ...config.default,
                restSpeedThreshold: 1,
                restDisplacementThreshold: 0.01,
            }}
            from={{ height: 0, opacity: 0, transform: 'translate3d(20px,0,0)' }}
            to={{
                height: state.open ? 'auto' : 0,
                opacity: state.open ? 1 : 0,
                transform: state.open ? 'translate3d(0px,0,0)' : 'translate3d(20px,0,0)',
            }}
            {...props.springConfig && props.springConfig(state.open)}>
            {children}
          </Spring>
        </div>
    )
}
