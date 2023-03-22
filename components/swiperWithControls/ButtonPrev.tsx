import back from './chevron-back.svg'
import styles from './Buttons.module.css'

const ButtonPrev: React.FC<Props> = ({ isBeginning, onPrevious }) => {
  return (
    <div className='my-auto'>
      <button
        disabled={isBeginning}
        onClick={onPrevious}
        className={styles.button}
      >
        <img src={back.src} width={32} alt='Previous' />
      </button>
    </div>
  )
}

interface Props {
  isBeginning?: boolean
  onPrevious?: () => void
}

export default ButtonPrev
