FROM mhart/alpine-node:8

# Install required dependencies (Alpine Linux packages)
RUN apk update && \
  apk add --no-cache \
    sudo \
    g++ \
    gcc \
    git \
    libev-dev \
    libevent-dev \
    libuv-dev \
    make \
    openssl-dev \
    perl \
    python

# Add user and make it sudoer
ARG uid=1000
ARG user=username
RUN set -x ; \
  addgroup -g $uid -S $user ; \
  adduser -u $uid -D -S -G $user $user \
  && exit 0 ; exit 1
RUN echo $user' ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# Install (global) NPM packages/dependencies
RUN yarn global add node-gyp
RUN git clone --recursive https://github.com/sass/node-sass.git \
  && cd node-sass \
  && npm install \
  && node scripts/build -f

# Make project directory with permissions
RUN mkdir /project

# Switch to project directory
WORKDIR /project

# Copy required stuff
COPY . .

# Give owner rights to the current user
RUN chown -Rh $user:$user /project

# Install (local) NPM packages and build
RUN yarn

USER $user
