import forward from './chevron-forward.svg'
import styles from './Buttons.module.css'

const ButtonNext: React.FC<Props> = ({ isEnd, onNext }) => {
  return (
    <div className='my-auto'>
      <button disabled={isEnd} onClick={onNext} className={styles.button}>
        <img src={forward.src} width={32} alt='Next' />
      </button>
    </div>
  )
}

interface Props {
  isEnd?: boolean
  onNext?: () => void
}

export default ButtonNext
