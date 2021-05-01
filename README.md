# CastCloud

![CastCloudHomePage](https://i.imgur.com/7IEmDy3.png)

## Table of Contents
- [Summary](#summary)
- [Technologies](#technologies)
- [Components](#components)
- [Installation](#installation)
- [Technical Challenges](#technical-challenges)

## Summary

[CastCloud](https://cast-cloud-js.herokuapp.com) is a podcast streaming application that draws inspiration from SoundCloud. It was developed using Express, React, and PostgresSQL. It uses the iTunes API to provide access to over 500,000 podcasts and RSS Feed parsing to continuously provide an updated episode list.

Feel free to visit the [project wiki](https://github.com/danielshoun/cast-cloud/wiki/) for specifics of the [MVP Feature List](https://github.com/danielshoun/cast-cloud/wiki/MVP-Feature-List), [DB Schema](https://github.com/danielshoun/cast-cloud/wiki/Database-Schema), [Routes](https://github.com/danielshoun/cast-cloud/wiki/Routes), [Components](https://github.com/danielshoun/cast-cloud/wiki/Components), and [State](https://github.com/danielshoun/cast-cloud/wiki/Redux-Store-Tree).

## Technologies

#### Back End
CastCloud's back end was created using Express. It primarily functions as a REST API to provide JSON objects to React.

Libraries:
- Sequelize
- JSONWebToken
- BCryptJS
- Faker
- RSS Parser


#### Front End
CastCloud's front end is a single page React application. Every component was built from scratch, including the audio player. Every feature of the application that manipulates data updates the page in real time without reloading.

Libraries:
- React Redux
- React HTML Parser

#### Database

CastCloud uses PostgresQL for storing information. An overview of the schema is pictured below.

![CastCloudDBSchema](https://i.imgur.com/AEIgRtp.png)

## Components

#### Audio Player

![CastCloudAudioPlayer](https://i.imgur.com/EMdJ9Pq.png)

CastCloud's audio player is custom made and fully featured. Users can control playback, volume levels, and audio scrubbing. They are also able to see useful information about the currently playing track.

#### Comment Feed

![CastCloudCommentFeed](https://i.imgur.com/bFeGDK6.png)

When a user is playing an episode, a button in the bottom right of the footer will allow them to open a comment feed. This shows comments left by other users in order of the timestamp the comment was made at. Users can edit and delete their comments after writing them.

#### Audio Queue

![CastCloudAudioQueue](https://i.imgur.com/BEr1eJo.png)

In order to allow for continuous playback, users can queue up multiple tracks. Users can view their queue by clicking a button in the bottom right of the footer. From this popup, they can click on a track to skip to it or click the trashcan to delete it from the queue.

#### Home Page

![CastCloudHomePage](https://i.imgur.com/QReSgJ0.png)

CastCloud's home page shows a few popular podcasts to help users get started. Five podcasts are randomly chosen from the Top 50 in order of subscription count to be displayed.

#### Podcast Details

![CastCloudPodcastDetails](https://i.imgur.com/7W1KUbd.png)

The podcast details page allows users to see a list of episodes for the podcast as well as the reviews. In order to save space, only episode titles are shown until the user clicks on it to reveal the description. The controller buttons to the right of each title update in real time as the user clicks them and as their queue changes.

#### Feed

![CastCloudFeed](https://i.imgur.com/NPJ5ric.png)

The feed page allows users to see all of their subscribed podcasts. By default, it shows a list of every unplayed episode for every podcast they are subscribed to. Clicking on a podcast's album art will show sorted lists of both unplayed and played episodes.

## Installation

The project can run by following these steps:
1. Clone the repo into your desired folder.
2. Run `npm install` from the root project directory.
3. Create a .env file in the backend directory following the example provided.
4. From the back end directory, run `npx dotenv sequelize db:create`, `npx dotenv sequelize db:migrate`, and `npx dotenv sequelize db:seed:all`
5. Run `npm start` from both the back end and front end directories.

To build the project, run `npm build` from the front end directory and then run `npm start` from the back end directory.

## Future Features

- [ ] Ability to reorganize the queue by clicking and dragging.
- [ ] Ability to create custom playlists.
- [ ] Ability to add private RSS feeds not found on iTunes.

## Technical Challenges

#### iTunes API

The iTunes API is what allows users to find almost any public podcast on CastCloud. Unfortunately, it is limited to 20 requests a minute. In order to scale the app for wider use, one would need to find some other avenue for retrieving search results. Options include Apple's developer partnership or other paid APIs.

#### RSS Parsing

Repeated parsing of RSS feeds can sometimes cause pages to hang for a few seconds. This is most apparent when viewing the Unplayed list in the Feed component, as all subscribed podcasts are checked for new episodes at this time, and when a user is the first person ever to view a podcast's details page. I attempted to optimize this by first sending a HEAD request to the RSS URL and using its `last-modified` header to determine whether an update is necessary, but the sheer number of requests (and episodes when they are needed) can cause some slowdown.

#### Audio Scrubbing

The scrubbing feature of the custom audio player can feel sluggish if the file being played is not fully buffered. The default controller does not suffer this issue, so I believe I can find some way to fix this.