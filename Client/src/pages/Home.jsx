import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import Grid from "@mui/material/Grid";

import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";
import { useEffect } from "react";
import { fetchPost, fetchTags } from "../redux/slices/posts";

export const Home = () => {
  const dispatch = useDispatch();
  const userData = window.localStorage.getItem("_id");
  const { posts, tags } = useSelector((state) => state.posts);

  const isPostsLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";

  const [value, setValue] = useState("1");
  const [sortedBy, setSortedBy] = useState("dataAsc");

  //-------------------------------------------------------------------------------------------------

  const handleSort = (sort) => {
    setSortedBy(sort);
  };

  //-------------------------------------------------------------------------------------------------

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //-------------------------------------------------------------------------------------------------

  useEffect(() => {
    dispatch(fetchTags());
  }, []);

  useEffect(() => {
    dispatch(fetchPost(sortedBy));
  }, [sortedBy]);

  return (
    <>
      <Box sx={{ borderBottom: 20, borderColor: "transparent", width: "100%" }}>
        <Tabs value={value} onChange={handleChange} aria-label='wrapped label tabs example'>
          <Tab value='1' onClick={() => handleSort("dataAsc")} label='Новые' />
          <Tab value='2' onClick={() => handleSort("dataDesc")} label='Старые' />
          <Tab value='3' onClick={() => handleSort("viewsAsc")} label='Популярные' />
        </Tabs>
      </Box>

      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                key={index}
                id={obj._id}
                title={obj.title}
                imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ""}
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={3}
                tags={obj.tags}
                isEditable={userData === obj.user._id}
              />
            ),
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: "Вася Пупкин",
                  avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
                },
                text: "Это тестовый комментарий",
              },
              {
                user: {
                  fullName: "Иван Иванов",
                  avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
                },
                text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
