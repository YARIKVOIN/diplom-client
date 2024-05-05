import styles from '@/styles/auth/index.module.scss'
import { IReplaceBoilerInput } from '@/types/boilerparts'

const Vendor_codeInput = ({ register, errors }: IReplaceBoilerInput) => (
  <label className={styles.form__label}>
    <input
      {...register('vendor_code', {
        required: 'Введите артикул!',
        minLength: 2,
        maxLength: 15,
        pattern: {
          value: /^[0-9]*$/,
          message: 'Недопустимое значение!',
        },
      })}
      className={styles.form__input}
      type="number"
      placeholder="Артикул"
      name='vendor_code'
    />
    {errors.name && (
      <span className={styles.error_alert}>{errors.name?.message}</span>
    )}
    {errors.name && errors.name.type === 'minLength' && (
      <span className={styles.error_alert}>Минимум 2 символа!</span>
    )}
    {errors.name && errors.name.type === 'maxLength' && (
      <span className={styles.error_alert}>Не более 15 символов!</span>
    )}
  </label>
)

export default Vendor_codeInput