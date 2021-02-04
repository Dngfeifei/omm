import React from 'react'
import PropTypes from 'prop-types'
import getWaterMarkCanvas from './WaterMarkCanvas'
import SecurityDefense from './SecurityDefense'
import moment from 'moment'

const defaultOptions = {
  chunkWidth: 420,
  chunkHeight: 200,//120,
  textAlign: 'left',
  textBaseline: 'top',//'top',
  globalAlpha: 0.3,//0.25,
  font: '18px Microsoft Yahei',
  rotateAngle: -0.6,//-0.46,
  fillStyle: '#1890ff'//'#666'
}

const waterMarkStyle = 'position: absolute;left: 0;right: 0;top:0;bottom:0;opacity: 0.7;z-index: 9999;pointer-events: none;overflow: hidden;background-color: transparent;background-repeat: repeat;'
const noop = function () { }

class WaterMark extends React.Component {

  async componentWillMount() {
    //  this.props.waterMarkText = `银信科技保密材料${localStorage.getItem('username')}${date}查阅`
    if (!window.WATER_MARK_URL) {
      window.WATER_MARK_URL = this.getCanvasUrl()
    }
    this.setState({ canvasUrl: window.WATER_MARK_URL })
  }

  state = {
    canvasUrl: ''
  }

  static propTypes = {
    children: PropTypes.element.isRequired,
    waterMarkText: PropTypes.string,
    openSecurityDefense: PropTypes.bool,
    securityAlarm: PropTypes.func,
    options: PropTypes.shape({
      chunkWidth: PropTypes.number,
      chunkHeight: PropTypes.number,
      textAlign: PropTypes.string,
      textBaseline: PropTypes.string,
      globalAlpha: PropTypes.number,
      font: PropTypes.string,
      rotateAngle: PropTypes.number,
      fillStyle: PropTypes.string
    })
  }

  constructor(props) {
    super(props)
    this.watermarkId = this.genRandomId('water-mark')
    this.watermarkWrapperId = this.genRandomId('water-mark-wrapper')
    this.security = null
    this.DOMRemoveObserver = null
    this.DOMAttrModifiedObserver = null
  }

  encrypt = (str) => {
    return window.btoa(decodeURI(encodeURIComponent(str)))
  }

  genRandomId = (prefix = '') => {
    return `${this.encrypt(prefix)}-${(new Date()).getTime()}-${Math.floor(Math.random() * Math.pow(10, 8))}`
  }

  componentDidMount() {
    const { openSecurityDefense, securityAlarm } = this.props
    if (openSecurityDefense) {
      const style = {
        waterMarkStyle,
        getCanvasUrl: this.getCanvasUrl
      }
      const securityHooks = {
        securityAlarm,
        updateObserver: this.updateObserver
      }
      const watermarkDOM = {
        watermarkId: this.watermarkId,
        watermarkWrapperId: this.watermarkWrapperId,
        genRandomId: this.genRandomId
      }
      this.security = new SecurityDefense(watermarkDOM, style, securityHooks)
    }
  }

  componentWillUnmount() {
    if (this.props.openSecurityDefense) {
      if (this.DOMRemoveObserver) {
        this.DOMRemoveObserver.disconnect()
      }
      if (this.DOMAttrModifiedObserver) {
        this.DOMAttrModifiedObserver.disconnect()
      }
      this.security = null
    }
  }

  updateObserver = (observers = {}) => {
    if (observers.DOMRemoveObserver) {
      this.DOMRemoveObserver = observers.DOMRemoveObserver
    }
    if (observers.DOMAttrModifiedObserver) {
      this.DOMAttrModifiedObserver = observers.DOMAttrModifiedObserver
    }
  }

  getCanvasUrl = () => {
    const { options } = this.props
    let date = moment().format('ll')
    let name = '';
    if (process.env.NODE_ENV == 'production') {
      name = process.env.ENV_NAME + '_'
    }
    const waterMarkText = `${localStorage.getItem(`${name}realName`)} ${date}`
    // const waterMarkText = `银信运维管理系统`
    const newOptions = Object.assign({}, defaultOptions, options)
    return getWaterMarkCanvas(waterMarkText, newOptions)
  }

  render() {
    const { children } = this.props
    const styles = {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      opacity: 0.7,
      zIndex: 9999,
      pointerEvents: 'none',
      overflow: 'hidden',
      backgroundImage: `url("${this.state.canvasUrl}")`,
      backgroundColor: 'transparent',
      backgroundRepeat: 'repeat'
    }

    return (
      <div className='water_mark_div' style={{ position: 'relative', height: '100%' }} id={this.watermarkWrapperId}>
        <div style={styles} id={this.watermarkId} />
        {children}
      </div>
    )
  }
}

WaterMark.defaultProps = {
  openSecurityDefense: false,
  securityAlarm: noop,
  options: defaultOptions
}

export default WaterMark