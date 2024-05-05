import styles from '@/styles/auth/index.module.scss'
import { IReplaceBoilerInput } from '@/types/boilerparts'
import {ReactSortable} from "react-sortablejs";
import {BounceLoader} from "react-spinners";
import { useCallback, useEffect, useState } from 'react'
import { useStore } from 'effector-react'

const [images,setImages] = useState(existingImages || []);
const [isUploading,setIsUploading] = useState(false);

async function uploadImages(ev) {
  const files = ev.target?.files;
  if (files?.length > 0) {
    setIsUploading(true);
    const data = new FormData();
    for (const file of files) {
      data.append('file', file);
    }
    const res = await axios.post('/api/upload', data);
    setImages(oldImages => {
      return [...oldImages, ...res.data.links];
    });
    setIsUploading(false);
  }
}
function updateImagesOrder(images) {
  setImages(images);
}


const ImagesInput = ({ register, errors }) => (
  
  <div className="mb-2 flex flex-wrap gap-1">
    <ReactSortable
      list={images}
      className="flex flex-wrap gap-1"
      setList={updateImagesOrder}>
      {!!images?.length && images.map(link => (
        <div key={link} className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
          <img src={link} alt="" className="rounded-lg"/>
        </div>
      ))}
    </ReactSortable>
    {isUploading && (
      <div className="h-24 flex items-center">
        <BounceLoader color={'#1E3A8A'} speedMultiplier={2} />
      </div>
    )}
    <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
      <div>
        Добавить
      </div>
      <input {...register('images', {
        required: 'Добавьте изображения!',
      })}
      type="file" onChange={uploadImages} className="hidden"/>
    </label>
  </div>
)

export default ImagesInput