import React from 'react';
import Navbar from './Navbar';
import Container from './Container';
import JobPost from './JobPost';
import ProfileCard from './ProfileCard';
import { Outlet } from 'react-router-dom';

export default function Profile() {
  return (
    <div>

      <div className="flex flex-row space-x-6 p-4 my-20">
        <div className="left w-2/4 bg-gray-100 p-4 rounded-md">
          <JobPost />
      <Navbar />

          <Container />
        </div>

        <div className="right w-2/4 bg-gray-200 p-4 rounded-md">
          <ProfileCard />
        </div>
      </div>

      <Outlet /> {/* This renders nested routes if needed */}
    </div>
  );
}
