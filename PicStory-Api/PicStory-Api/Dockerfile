FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# מעתיקים רק את הפרויקט הנכון
COPY PicStory-Api/ PicStory-Api/

WORKDIR /src/PicStory-Api
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "PicStory.dll"]