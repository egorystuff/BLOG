import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { selectIsAuth } from "../../redux/slices/auth";
import axios from "../../axios";

export const AddPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const [isLoading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const inputFileRef = useRef(null);

  const isEditing = Boolean(id);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append("image", file);
      const { data } = await axios.post("/upload", formData);
      setImageUrl(data.url);
    } catch (error) {
      console.log(error);
      alert("Не удалось загрузить файл");
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl("");
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      setLoading(true);

      const fields = {
        title,
        imageUrl,
        tags,
        text,
      };
      const { data } = isEditing ? await axios.patch(`/posts/${id}`, fields) : await axios.post("/posts", fields);

      const _id = isEditing ? id : data._id;

      navigate(`/posts/${_id}`);
    } catch (error) {
      console.warn(error);
      alert("Ошибка при создании статьи");
    }
  };

  useEffect(() => {
    if (id) {
      axios.get(`/posts/${id}`).then(({ data }) => {
        setTitle(data.title);
        setText(data.text);
        setTags(data.tags.join(","));
        setImageUrl(data.imageUrl);
      });
    }
  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введите текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to='/' replace />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant='outlined' size='large'>
        Загрузить превью
      </Button>
      <input ref={inputFileRef} type='file' onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button variant='contained' color='error' onClick={onClickRemoveImage}>
            Удалить
          </Button>
          <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt='Uploaded' />
        </>
      )}

      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant='standard'
        placeholder='Заголовок статьи...'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant='standard'
        placeholder='Тэги'
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        fullWidth
      />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size='large' variant='contained'>
          {isEditing ? "Сохранить изменения" : "Опубликовать"}
        </Button>
        <Link to='/'>
          <Button size='large'>Отмена</Button>
        </Link>
      </div>
    </Paper>
  );
};
