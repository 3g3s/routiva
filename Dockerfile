# 1. AŞAMA: .NET SDK ve Node.js ile Derleme (Build)
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build-env
WORKDIR /app

# ClientApp'in derlenebilmesi için Node.js kurulumu gerekir
RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

# Proje dosyalarını kopyala ve restore et
COPY *.csproj ./
RUN dotnet restore

# Tüm kodları kopyala ve yayınla (Publish)
COPY . ./
RUN dotnet publish -c Release -o out

# 2. AŞAMA: Çalışma Zamanı (Runtime)
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build-env /app/out .

# Railway'in dinamik port sistemine uyum sağlama
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

# Çıktı dosyanızın adı (Routiva.csproj olduğu için Routiva.dll olacaktır)
ENTRYPOINT ["dotnet", "Routiva.dll"]