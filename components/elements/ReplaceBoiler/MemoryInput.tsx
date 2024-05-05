import styles from '@/styles/auth/index.module.scss'
import { IReplaceBoilerInput } from '@/types/boilerparts'

const MemoryInput = ({ register, errors }: IReplaceBoilerInput) => (
  <label className={styles.form__label}>
    <select {...register('memory', {
        required: 'Выберите память устройства!',
      })}
      name='memory'
      className={styles.form__input}>
  <option value="">--Память товара?--</option>
  <option value="32GB">32GB</option>
  <option value="64GB">64GB</option>
  <option value="128GB">128GB</option>
  <option value="256GB">256GB</option>
  <option value="512GB">512GB</option>
  <option value="1TB">1TB</option>
</select>
  </label>
)

export default MemoryInput