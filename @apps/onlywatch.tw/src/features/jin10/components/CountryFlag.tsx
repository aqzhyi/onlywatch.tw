import {
  US,
  DE,
  EU,
  JP,
  AU,
  NZ,
  CA,
  CH,
  CN,
  HK,
  TW,
  FR,
  GB,
  KR,
} from 'country-flag-icons/react/1x1'

export function CountryFlag(props: { country: null | string }) {
  switch (props.country) {
    case 'TWD':
      return <TW className='h-6 w-6' />
    case 'USD':
      return <US className='h-6 w-6' />
    case 'EUR':
      return <EU className='h-6 w-6' />
    case 'GBP':
      return <GB className='h-6 w-6' />
    case 'DE':
      return <DE className='h-6 w-6' />
    case 'FR':
      return <FR className='h-6 w-6' />
    case 'JPY':
      return <JP className='h-6 w-6' />
    case 'AUD':
      return <AU className='h-6 w-6' />
    case 'NZD':
      return <NZ className='h-6 w-6' />
    case 'CAD':
      return <CA className='h-6 w-6' />
    case 'CHF':
      return <CH className='h-6 w-6' />
    case 'CNY':
      return <CN className='h-6 w-6' />
    case 'HKD':
      return <HK className='h-6 w-6' />
    case 'KR':
      return <KR className='h-6 w-6' />
    default:
      return (
        <div
          data-country={props.country}
          className='h-6 w-6'
        >
          🏳️
        </div>
      )
  }
}
