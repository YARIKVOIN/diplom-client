import styles from '@/styles/auth/index.module.scss'
import { IReplaceBoilerInput } from '@/types/boilerparts'

const DisplayInput = ({ register, errors }: IReplaceBoilerInput) => (
  <label className={styles.form__label}>
    <input
      {...register('display', {
        required: 'Введите дисплей!',
        minLength: 5,
        maxLength: 255,
      })}
      name='display'
      className={styles.form__input}
      type="text"
      placeholder="Дисплей гаджета"
    />
    {errors.name && (
      <span className={styles.error_alert}>{errors.name?.message}</span>
    )}
    {errors.name && errors.name.type === 'minLength' && (
      <span className={styles.error_alert}>Минимум 5 символов!</span>
    )}
    {errors.name && errors.name.type === 'maxLength' && (
      <span className={styles.error_alert}>Не более 255 символов!</span>
    )}
  </label>
)

export default DisplayInput