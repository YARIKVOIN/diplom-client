import styles from '@/styles/auth/index.module.scss'
import { IReplaceBoilerInput } from '@/types/boilerparts'

const DescriptionInput = ({ register, errors }: IReplaceBoilerInput) => (
  <label className={styles.form__label}>
    <input
      {...register('description', {
        required: 'Введите описание!',
      })}
      className={styles.form__input}
      type="text"
      placeholder="Описание гаджета"
      name='description'
    />
    {errors.name && (
      <span className={styles.error_alert}>{errors.name?.message}</span>
    )}
  </label>
)

export default DescriptionInput