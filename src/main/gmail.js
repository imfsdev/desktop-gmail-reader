import ElectronGoogleOAuth2 from '@dejay/electron-google-oauth2'

export async function googleSignIn() {
  const myApiOauth = new ElectronGoogleOAuth2(
    process.env.VUE_APP_GOOGLE_CLIENT_ID,
    process.env.VUE_APP_GOOGLE_CLIENT_SECRET,
    [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.modify'
    ],
    {
      successRedirectURL: 'https://github.com'
    }
  )
  const token = await myApiOauth.openAuthWindowAndGetTokens()

  return token
}
