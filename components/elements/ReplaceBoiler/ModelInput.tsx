import styles from '@/styles/auth/index.module.scss'
import { IReplaceBoilerInput } from '@/types/boilerparts'

const ModelInput = ({ register, errors }: IReplaceBoilerInput) => (
  <label className={styles.form__label}>
    <select {...register('model', {
        required: 'Выберите производителя!',
      })}
      name='model'
      className={styles.form__input}>
  <option value="">--Модель товара?--</option>
  <option value="Apple">Apple</option>
  <option value="Samsung">Samsung</option>
  <option value="Xiaomi">Xiaomi</option>
  <option value="Lenovo">Lenovo</option>
  <option value="Asus">Asus</option>
  <option value="LG">LG</option>
  <option value="Acer">Acer</option>
  <option value="Huawei">Huawei</option>
  <option value="Honor">Honor</option>
  <option value="Poco">Poco</option>
</select>
  </label>
)

export default ModelInput