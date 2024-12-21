import React from 'react';
import { Routes, Route, Outlet } from "react-router-dom";
import Post from './Post';
import Comment from './Comment';
import Comm from './Comm';
export default function Container() {
  return (
    <div>
      {/* <h2>Content Area</h2> */}
      <Routes>
        <Route path="post" element={<Post />} />
        <Route path="comment" element={<Comment />} />
        <Route path="community" element={< Comm/>} />


      </Routes>
      <Outlet /> {/* This renders the nested routes */}
    </div>
  );
}
