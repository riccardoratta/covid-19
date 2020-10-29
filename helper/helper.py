import click
import requests
import csv

file = 'data.csv'
url_head = 'https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni'
url_tail = '.csv'
api_url = 'https.//localhost:80'

@click.group(chain=True)
def main():
    """
    Simple CLI for downloading and posting data
    """
    pass

@main.command()
@click.option('-a', '--all', is_flag=True)
@click.option('-l', '--lastest', is_flag=True)
@click.option('-d', '--date')
def download(all, lastest, date):
    "Download by date, all, or last (options hierarchy: all > last > date)"

    if all:
        click.echo("Downloading all days data...")
        query = ''
    elif lastest:
        click.echo("Downloading lastest day data...")
        query = '-latest'
    elif date:
        click.echo("Download data corrisponding to day " + date + " in yyyymmdd format (Ex. 20200304 download for 04 March 2020)...")
        query = '-' + date
    else :
        click.echo(click.get_current_context().get_help())
        return

    url = url_head + query + url_tail
    click.echo("Fetching: " + url)
    response = requests.get(url)
    open(file, 'wb').write(response.content)


@main.command()
def send():
    "Send data to db (post)"

    with open(file) as csvfile:
        reader = csv.DictReader(csvfile)
        field = reader.fieldnames
        for row in reader:
            payload = {field[i]:row[field[i]] for i in range(len(field))}
            #response = requests.post(api_url + '/regions', data=payload)
            #print(payload)


if __name__ == "__main__":
    main()
