import styles from '@/styles/auth/index.module.scss'
import { IReplaceBoilerInput } from '@/types/boilerparts'

const PriceInput = ({ register, errors }: IReplaceBoilerInput) => (
  <label className={styles.form__label}>
    <input
      {...register('price', {
        required: 'Введите цену!',
        pattern: {
            value: /^[0-9]*$/,
            message: 'Недопустимое значение!',
          },
      })}
      name='price'
      className={styles.form__input}
      type="number"
      placeholder="Цена"
    />
    {errors.name && (
      <span className={styles.error_alert}>{errors.name?.message}</span>
    )}
  </label>
)

export default PriceInput